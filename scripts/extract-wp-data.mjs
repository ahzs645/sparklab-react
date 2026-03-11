/**
 * Extract WordPress data from local MySQL database into JSON files.
 * Also copies media files (images + 3D models) to public/wp-content/.
 *
 * Usage: node scripts/extract-wp-data.mjs
 */

import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const WP_UPLOADS = '/Users/ahmadjalil/Local Sites/sparklab/app/public/wp-content/uploads';
const PUBLIC_WP = path.join(ROOT, 'public', 'wp-content', 'uploads');

const SOCKET = '/Users/ahmadjalil/Library/Application Support/Local/run/ysNn2dCer/mysql/mysqld.sock';

async function main() {
  const conn = await mysql.createConnection({
    socketPath: SOCKET,
    user: 'root',
    password: 'root',
    database: 'local',
  });

  console.log('Connected to WordPress database');

  // 1. Get all published posts with categories
  const [posts] = await conn.execute(`
    SELECT p.ID, p.post_title, p.post_content, p.post_date, p.post_excerpt, p.post_name, p.post_type,
      GROUP_CONCAT(DISTINCT t.name) as categories,
      GROUP_CONCAT(DISTINCT t.slug) as category_slugs
    FROM wp_posts p
    LEFT JOIN wp_term_relationships tr ON p.ID = tr.object_id
    LEFT JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = 'category'
    LEFT JOIN wp_terms t ON tt.term_id = t.term_id
    WHERE p.post_status = 'publish' AND p.post_type = 'post'
    GROUP BY p.ID
    ORDER BY p.post_date DESC
  `);

  // 2. Get featured images
  const [thumbnails] = await conn.execute(`
    SELECT p.ID as post_id, att.guid as thumbnail_url,
      pm2.meta_value as attachment_file
    FROM wp_posts p
    JOIN wp_postmeta pm ON p.ID = pm.post_id AND pm.meta_key = '_thumbnail_id'
    JOIN wp_posts att ON att.ID = pm.meta_value
    LEFT JOIN wp_postmeta pm2 ON att.ID = pm2.post_id AND pm2.meta_key = '_wp_attached_file'
    WHERE p.post_status = 'publish' AND p.post_type = 'post'
  `);

  const thumbMap = {};
  for (const t of thumbnails) {
    thumbMap[t.post_id] = t.attachment_file || t.thumbnail_url;
  }

  // 3. Get all image and model attachments for content URL mapping
  const [attachments] = await conn.execute(`
    SELECT ID, guid, post_mime_type,
      (SELECT meta_value FROM wp_postmeta WHERE post_id = wp_posts.ID AND meta_key = '_wp_attached_file') as file_path
    FROM wp_posts
    WHERE post_type = 'attachment'
  `);

  // 4. Parse and categorize posts
  const projects = [];
  const blogPosts = [];

  for (const post of posts) {
    const cats = (post.category_slugs || '').split(',');
    const isProject = cats.includes('projects') || isProjectContent(post.post_content);

    const parsed = {
      id: post.ID,
      title: post.post_title,
      slug: post.post_name,
      date: post.post_date,
      excerpt: post.post_excerpt || extractExcerpt(post.post_content),
      featuredImage: thumbMap[post.ID] || null,
      categories: (post.categories || 'Uncategorized').split(','),
    };

    if (isProject) {
      const projectData = parseProjectContent(post.post_content);
      projects.push({ ...parsed, ...projectData });
    } else {
      blogPosts.push({
        ...parsed,
        content: stripWpBlocks(post.post_content),
      });
    }
  }

  // 5. Copy media files
  await copyMediaFiles(projects, blogPosts);

  // 6. Write JSON files
  const dataDir = path.join(ROOT, 'src', 'data');
  await fs.mkdir(dataDir, { recursive: true });

  await fs.writeFile(
    path.join(dataDir, 'projects.json'),
    JSON.stringify(projects, null, 2)
  );
  await fs.writeFile(
    path.join(dataDir, 'blogPosts.json'),
    JSON.stringify(blogPosts, null, 2)
  );

  console.log(`Extracted ${projects.length} projects and ${blogPosts.length} blog posts`);
  await conn.end();
}

function isProjectContent(content) {
  return content.includes('Objectives and Constraints') ||
    content.includes('Materials and Tools') ||
    content.includes('model-viewer');
}

function extractExcerpt(content) {
  const text = content
    .replace(/<!--.*?-->/gs, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.substring(0, 200) + (text.length > 200 ? '...' : '');
}

function stripWpBlocks(content) {
  // Remove WordPress block comments but keep HTML
  return content
    .replace(/<!-- wp:[^\n]*-->/g, '')
    .replace(/<!-- \/wp:[^\n]*-->/g, '')
    .replace(/\\n/g, '\n')
    .trim();
}

function rewriteUrl(url) {
  if (!url) return null;
  // Convert sparklab.local or sparklab.unbc.ca URLs to local paths
  return url
    .replace(/https?:\/\/sparklab\.local\/wp-content\/uploads\//, '/wp-content/uploads/')
    .replace(/https?:\/\/sparklab\.unbc\.ca\/wp-content\/uploads\//, '/wp-content/uploads/');
}

function parseProjectContent(content) {
  const result = {
    modelViewer: null,
    designer: null,
    projectDate: null,
    contact: null,
    lab: null,
    objectives: [],
    materials: [],
    phases: [],
    skillsDeveloped: [],
    supportResources: [],
    productImages: [],
    clientFeedback: null,
    contentHtml: stripWpBlocks(content),
  };

  // Extract model viewer data
  const modelMatch = content.match(/data-modelviewer="([^"]+)"/);
  if (modelMatch) {
    try {
      const decoded = modelMatch[1].replace(/&quot;/g, '"');
      const mvData = JSON.parse(decoded);
      result.modelViewer = {
        src: rewriteUrl(mvData.modelViewerSrc),
        poster: mvData.modelViewerPoster ? rewriteUrl(mvData.modelViewerPoster) : null,
        height: mvData.bl_height || 500,
        autoRotate: mvData.camera_autoRotate || false,
        cameraOrbit: `${mvData.camera_orbit_theta || 0}deg ${mvData.camera_orbit_phi || 75}deg ${mvData.camera_orbit_radius || 105}%`,
        cameraTarget: `${mvData.camera_target_x || 0}m ${mvData.camera_target_y || 0}m ${mvData.camera_target_z || 0}%`,
        bgColor: mvData.bg_color || 'transparent',
      };
    } catch (e) {
      console.warn('Failed to parse model viewer data:', e.message);
    }
  }

  // Extract date and designer from the first paragraph
  const infoMatch = content.match(/<p><strong>Date:?<\/strong>:?\s*(.*?)(?:<br\s*\/?>|\n)/);
  if (infoMatch) result.projectDate = infoMatch[1].trim();

  const designerMatch = content.match(/<strong>Designer:?<\/strong>:?\s*(.*?)(?:<br|<\/p>|\n)/);
  if (designerMatch) result.designer = designerMatch[1].trim();

  const contactMatch = content.match(/<strong>Contact:?<\/strong>:?\s*(?:<a[^>]*>)?(.*?)(?:<\/a>)?(?:<br|<\/p>|\n)/);
  if (contactMatch) result.contact = contactMatch[1].trim();

  const labMatch = content.match(/<strong>Lab:?<\/strong>:?\s*(.*?)(?:<br|<\/p>|\n)/);
  if (labMatch) result.lab = labMatch[1].trim();

  // Extract objectives
  const objSection = extractSection(content, 'Objectives and Constraints');
  if (objSection) {
    result.objectives = extractListItems(objSection);
  }

  // Extract materials
  const matSection = extractSection(content, 'Materials and Tools');
  if (matSection) {
    result.materials = extractListItems(matSection);
  }

  // Extract phases
  const phasesStart = content.indexOf('Phases of Development');
  if (phasesStart > -1) {
    const phasesContent = content.substring(phasesStart);
    const phaseHeaders = [...phasesContent.matchAll(/<h4[^>]*><strong>(.*?)<\/strong><\/h4>/g)];

    for (const header of phaseHeaders) {
      const phaseTitle = header[1];
      const startIdx = phasesContent.indexOf(header[0]) + header[0].length;
      const nextH4 = phasesContent.indexOf('<h4', startIdx);
      const nextH3 = phasesContent.indexOf('<h3', startIdx);
      const endIdx = Math.min(
        nextH4 > -1 ? nextH4 : Infinity,
        nextH3 > -1 ? nextH3 : Infinity,
        phasesContent.length
      );
      const phaseContent = phasesContent.substring(startIdx, endIdx);
      const items = extractListItems(phaseContent);
      result.phases.push({ title: phaseTitle, items });
    }
  }

  // Extract skills
  const skillsSection = extractSection(content, 'Skills Developed');
  if (skillsSection) {
    result.skillsDeveloped = extractSimpleListItems(skillsSection);
  }

  // Extract support
  const supportSection = extractSection(content, 'Support and Resources');
  if (supportSection) {
    result.supportResources = extractListItems(supportSection);
  }

  // Extract product images
  const imgMatches = [...content.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g)];
  const figCaptions = [...content.matchAll(/<strong>Figure \d+:?<\/strong>:?\s*(.*?)<\/li>/g)];

  result.productImages = imgMatches.map((m, i) => ({
    src: rewriteUrl(m[1]),
    alt: m[2],
    caption: figCaptions[i] ? figCaptions[i][1].trim() : '',
  }));

  // Extract client feedback
  const quoteMatch = content.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/);
  if (quoteMatch) {
    const quoteContent = quoteMatch[1]
      .replace(/<!--.*?-->/gs, '')
      .replace(/<\/?p>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Try to extract client name from the end
    const nameMatch = quoteContent.match(/[–—-]\s*(.*?)$/m);
    result.clientFeedback = {
      quote: nameMatch ? quoteContent.substring(0, nameMatch.index).trim() : quoteContent,
      name: nameMatch ? nameMatch[1].trim() : '',
    };
  }

  return result;
}

function extractSection(content, heading) {
  const regex = new RegExp(`<h3[^>]*><strong>${heading}<\\/strong><\\/h3>`, 'i');
  const match = content.match(regex);
  if (!match) return null;

  const startIdx = content.indexOf(match[0]) + match[0].length;
  // Find next h3
  const nextH3 = content.indexOf('<h3', startIdx);
  const endIdx = nextH3 > -1 ? nextH3 : content.length;
  return content.substring(startIdx, endIdx);
}

function extractListItems(html) {
  const items = [];
  const matches = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)];
  for (const m of matches) {
    const text = m[1]
      .replace(/<!--.*?-->/gs, '')
      .replace(/<\/?strong>/g, '**')
      .replace(/<[^>]+>/g, '')
      .replace(/\\n/g, ' ')
      .trim();
    if (text) items.push(text);
  }
  return items;
}

function extractSimpleListItems(html) {
  const items = [];
  const matches = [...html.matchAll(/<li>([\s\S]*?)<\/li>/g)];
  for (const m of matches) {
    const text = m[1]
      .replace(/<!--.*?-->/gs, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\\n/g, ' ')
      .trim();
    if (text) items.push(text);
  }
  return items;
}

async function copyMediaFiles(projects, blogPosts) {
  // Collect all referenced file paths
  const files = new Set();

  for (const p of projects) {
    if (p.featuredImage) files.add(p.featuredImage);
    if (p.modelViewer?.src) {
      const filePath = p.modelViewer.src.replace(/^\/wp-content\/uploads\//, '');
      files.add(filePath);
    }
    for (const img of p.productImages || []) {
      if (img.src) {
        const filePath = img.src.replace(/^\/wp-content\/uploads\//, '');
        files.add(filePath);
      }
    }
  }

  for (const bp of blogPosts) {
    if (bp.featuredImage) files.add(bp.featuredImage);
  }

  let copied = 0;
  for (const filePath of files) {
    const cleanPath = filePath
      .replace(/^\/wp-content\/uploads\//, '')
      .replace(/https?:\/\/[^/]+\/wp-content\/uploads\//, '');

    const srcPath = path.join(WP_UPLOADS, cleanPath);
    const destPath = path.join(PUBLIC_WP, cleanPath);

    try {
      await fs.access(srcPath);
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      await fs.copyFile(srcPath, destPath);
      copied++;
    } catch {
      // Also try without size suffix (e.g., -768x1024)
      const noSizePath = cleanPath.replace(/-\d+x\d+(\.\w+)$/, '$1');
      const altSrcPath = path.join(WP_UPLOADS, noSizePath);
      try {
        await fs.access(altSrcPath);
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(altSrcPath, destPath);
        copied++;
      } catch {
        console.warn(`  Missing: ${cleanPath}`);
      }
    }
  }

  console.log(`Copied ${copied} media files`);
}

main().catch(console.error);
