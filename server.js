#!/usr/bin/env node

/**
 * DEVELOPMENT SERVER - Quick Start Script
 * Run this for local development testing
 * 
 * Usage:
 *   node server.js
 *   or
 *   npx http-server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const HOST = 'localhost';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.md': 'text/markdown',
    '.txt': 'text/plain',
};

const server = http.createServer((req, res) => {
    // Parse URL using WHATWG URL API
    const baseUrl = `http://${HOST}:${PORT}`;
    const requestUrl = new URL(req.url, baseUrl);
    let pathname = requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname;
    
    // Remove leading slash
    pathname = pathname.replace(/^\//, '');
    
    // Construct full file path
    const filePath = path.resolve(__dirname, pathname);
    
    // Security: Prevent directory traversal
    if (!filePath.startsWith(path.resolve(__dirname))) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err) {
            // File not found
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - Page Not Found</title>
                        <style>
                            body { font-family: Georgia, serif; background: #0a0e27; color: #b19cd9; padding: 40px; text-align: center; }
                            h1 { font-size: 48px; }
                            p { font-size: 20px; }
                            a { color: #87ceeb; text-decoration: none; }
                            a:hover { text-decoration: underline; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - Page Not Found</h1>
                        <p>Sorry, the requested file was not found.</p>
                        <p>Requested: ${pathname}</p>
                        <p><a href="/">← Go back to home</a></p>
                    </body>
                    </html>
                `);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            return;
        }
        
        // Check if it's a directory
        if (stats.isDirectory()) {
            // Try to serve index.html from directory
            const indexPath = path.join(filePath, 'index.html');
            fs.stat(indexPath, (err) => {
                if (err) {
                    res.writeHead(403, { 'Content-Type': 'text/plain' });
                    res.end('Forbidden - Directory listing not allowed');
                } else {
                    serveFile(indexPath, res);
                }
            });
            return;
        }
        
        // Serve file
        serveFile(filePath, res);
    });
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Set CORS headers for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Cache control
    res.setHeader('Cache-Control', 'no-cache');
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
            return;
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
    });
}

// Start server
server.listen(PORT, HOST, () => {
    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║                                                ║');
    console.log('║  🌧️  27 Chapters of Rain - Dev Server Started ║');
    console.log('║                                                ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    
    console.log(`📍 Server running at: http://${HOST}:${PORT}/`);
    console.log(`📂 Serving files from: ${__dirname}\n`);
    
    console.log('📖 Open in browser:');
    console.log(`   http://${HOST}:${PORT}/\n`);
    
    console.log('💾 Available routes:');
    console.log(`   / - Main experience`);
    console.log(`   /index.html - Homepage`);
    console.log(`   /assets/ - Static assets\n`);
    
    console.log('⌨️  Keyboard shortcuts:');
    console.log(`   M - Toggle mute`);
    console.log(`   F11 - Fullscreen`);
    console.log(`   D - Debug info`);
    console.log(`   Esc - Close book\n`);
    
    console.log('🛑 To stop server: Press Ctrl+C\n');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Error: Port ${PORT} is already in use`);
        console.error(`\nTry using a different port:`);
        console.error(`   PORT=3000 node server.js\n`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down server...\n');
    server.close(() => {
        console.log('✓ Server stopped\n');
        process.exit(0);
    });
});
