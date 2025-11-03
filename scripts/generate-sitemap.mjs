#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Configuration
const SITE_URL = process.env.VITE_PUBLIC_SITE_URL || 'https://textileoem.com';
const PAGES_DIR = join(__dirname, '..', 'src', 'pages');
const OUTPUT_FILE = join(__dirname, '..', 'public', 'sitemap.xml');

// Define page priorities
const PAGE_PRIORITIES = {
  '/': '1.0',
  '/about': '0.8',
  '/products': '0.8',
  '/certifications': '0.7',
  '/contact': '0.7',
  '/login': '0.5',
  // Portal pages are excluded from sitemap (noindex)
};

// Function to extract route from file content
function extractRouteFromFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    
    // Look for route patterns in the file
    const routeMatch = content.match(/path=["']([^"']+)["']/);
    if (routeMatch) {
      return routeMatch[1];
    }
    
    // Fallback: derive from filename
    const fileName = filePath.split(/[/\\]/).pop().replace('.tsx', '');
    if (fileName === 'Home') return '/';
    if (fileName === 'Index') return '/';
    if (fileName === 'NotFound') return null; // Exclude 404 page
    
    return `/${fileName.toLowerCase()}`;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

// Function to scan pages directory
function scanPagesDirectory(dir) {
  const routes = [];
  
  try {
    const files = readdirSync(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const stat = statSync(filePath);
      
      if (stat.isDirectory()) {
        // Recursively scan subdirectories
        routes.push(...scanPagesDirectory(filePath));
      } else if (extname(file) === '.tsx') {
        const route = extractRouteFromFile(filePath);
        if (route && !route.includes('dashboard') && !route.includes('orders') && 
            !route.includes('compliance') && !route.includes('analytics') && 
            !route.includes('settings')) {
          routes.push(route);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error.message);
  }
  
  return routes;
}

// Generate sitemap XML
function generateSitemap(routes) {
  const now = new Date().toISOString();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add homepage first
  sitemap += `
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${PAGE_PRIORITIES['/'] || '0.8'}</priority>
  </url>`;

  // Add other pages
  const uniqueRoutes = [...new Set(routes)].filter(route => route !== '/');
  
  for (const route of uniqueRoutes) {
    const priority = PAGE_PRIORITIES[route] || '0.7';
    sitemap += `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }

  sitemap += `
</urlset>`;

  return sitemap;
}

// Main execution
function main() {
  console.log('🔍 Scanning pages directory...');
  
  const routes = scanPagesDirectory(PAGES_DIR);
  console.log(`📄 Found ${routes.length} routes:`, routes);
  
  console.log('📝 Generating sitemap...');
  const sitemap = generateSitemap(routes);
  
  console.log('💾 Writing sitemap to public/sitemap.xml...');
  writeFileSync(OUTPUT_FILE, sitemap, 'utf8');
  
  console.log('✅ Sitemap generated successfully!');
  console.log(`📍 Location: ${OUTPUT_FILE}`);
  console.log(`🌐 Site URL: ${SITE_URL}`);
}

// Run the script
main();
