# Deployment Guide

Complete guide to deploying the "27 Chapters of Rain" experience to production.

## Pre-Deployment Checklist

- [ ] All audio files added to `assets/audio/`
- [ ] Optional images added to `assets/images/`
- [ ] Tested in Chrome, Firefox, Safari, and Edge
- [ ] Tested on mobile devices
- [ ] Audio volumes adjusted properly
- [ ] No JavaScript errors in console
- [ ] All links working and accessible
- [ ] Performance optimization completed
- [ ] SEO meta tags added (optional)
- [ ] Google Analytics setup (optional)

## Deployment Options

### Option 1: Netlify (Recommended - Free & Easy)

1. **Create Netlify Account**
   - Go to netlify.com
   - Sign up with GitHub/GitLab/Bitbucket

2. **Connect Repository**
   - Go to New Site > Connect to Git
   - Select your repository
   - Deploy main branch

3. **Configure**
   - Build command: (leave empty)
   - Publish directory: `.`

4. **Deploy**
   - Click Deploy
   - Get live URL instantly

5. **Domain Setup (Optional)**
   - Add custom domain
   - Auto HTTPS enabled

### Option 2: Vercel (Free & Fast)

1. **Create Vercel Account**
   - Go to vercel.com
   - Sign up

2. **Import Project**
   - Click Import Project
   - Select Git repository

3. **Deploy**
   - Click Deploy
   - Live in seconds

### Option 3: GitHub Pages (Free)

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/megha-birthday.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to Repository Settings
   - Navigate to Pages
   - Select main branch
   - Save

3. **Access Site**
   - Available at: `https://yourusername.github.io/megha-birthday/`

### Option 4: AWS S3 + CloudFront

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://megha-birthday-website
   ```

2. **Upload Files**
   ```bash
   aws s3 sync . s3://megha-birthday-website --delete
   ```

3. **Enable Static Hosting**
   - Bucket > Properties > Static website hosting
   - Enable
   - Index document: index.html

4. **CloudFront Distribution**
   - Create distribution
   - Origin: S3 bucket
   - Enable HTTPS

### Option 5: Traditional Web Hosting

1. **Choose Host**
   - Bluehost, GoDaddy, HostGator, etc.
   - Get cPanel or FTP access

2. **Upload Files**
   - Use FTP client (FileZilla, WinSCP)
   - Upload all files to `public_html/`

3. **Configure**
   - Set index.html as default
   - Enable HTTPS if available

4. **Access Site**
   - megha-birthday-website.com (or your domain)

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install -g http-server

EXPOSE 80

CMD ["http-server", "-p", "80", "--cors"]
```

### Build & Run

```bash
docker build -t megha-birthday .
docker run -p 80:80 megha-birthday
```

### Deploy to Docker Hub

```bash
docker tag megha-birthday yourusername/megha-birthday
docker push yourusername/megha-birthday
```

## Environment-Specific Configuration

### Development

```javascript
// js/config.js
const isDev = location.hostname === 'localhost';
if (isDev) {
    CONFIG.FEATURES.ENABLE_SOUND = true;
    CONFIG.PERFORMANCE.MAX_PARTICLES = 500;
}
```

### Production

```javascript
const isProd = !location.hostname.includes('localhost');
if (isProd) {
    // Reduce performance impact
    CONFIG.PARTICLES.STAR_COUNT = 600;
    CONFIG.PARTICLES.RAIN_COUNT = 100;
}
```

## Performance Optimization for Production

### 1. Minify Code

```bash
# Install Terser
npm install -g terser

# Minify JavaScript
terser js/main.js -o js/main.min.js
```

### 2. Compress Images

```bash
# Using ImageMagick
convert chapter-01.jpg -quality 85 chapter-01.jpg

# Or use TinyPNG API programmatically
```

### 3. Enable Gzip Compression

#### Netlify (automatic)
#### Vercel (automatic)
#### Manual (via .htaccess for Apache)

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

### 4. Set Cache Headers

```apache
<FilesMatch "\.(jpg|jpeg|png|gif|webp)$">
    Header set Cache-Control "max-age=2592000, public"
</FilesMatch>

<FilesMatch "\.(js|css)$">
    Header set Cache-Control "max-age=604800, public"
</FilesMatch>

<FilesMatch "\.(html)$">
    Header set Cache-Control "max-age=3600, public"
</FilesMatch>

<FilesMatch "\.(mp3|ogg|wav)$">
    Header set Cache-Control "max-age=2592000, public"
</FilesMatch>
```

## SEO Optimization (Optional)

### Add Meta Tags

```html
<meta name="description" content="An interactive 3D birthday experience celebrating Megha's 27 years.">
<meta name="keywords" content="birthday, 3D, interactive, experience">
<meta property="og:title" content="27 Chapters of Rain - Megha">
<meta property="og:description" content="A cinematic journey through 27 chapters of magic.">
<meta property="og:image" content="https://your-domain.com/og-image.jpg">
<meta name="theme-color" content="#2d1b4e">
```

### Create sitemap.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## Analytics Setup (Optional)

### Google Analytics

```html
<!-- Add to <head> section of index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## HTTPS & Security

### Let's Encrypt (Free SSL)

Most hosting platforms handle this automatically, but for manual setup:

```bash
# Using Certbot
sudo certbot certonly --standalone -d megha-birthday-website.com
```

### Security Headers

```apache
# .htaccess
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "no-referrer-when-downgrade"
```

## Monitoring & Maintenance

### Check Performance

- Google PageSpeed Insights
- GTmetrix
- WebPageTest

### Monitor Errors

- Sentry (error tracking)
- Rollbar (error monitoring)
- LogRocket (session replay)

### Analytics

- Google Analytics
- Plausible Analytics (privacy-friendly)
- Simple Analytics

## Custom Domain Setup

### Point Domain to Hosting

1. **Get Domain**
   - Register at GoDaddy, Namecheap, etc.

2. **Update DNS Records**
   ```
   For Netlify:
   Type: A
   Value: 75.2.60.5
   
   Or use CNAME:
   Type: CNAME
   Value: your-site.netlify.app
   ```

3. **Wait for DNS Propagation**
   - Can take 24-48 hours
   - Check with: `nslookup yourdomain.com`

4. **Enable HTTPS**
   - Most platforms do this automatically
   - Or generate Let's Encrypt certificate

## Troubleshooting Deployment

### Audio Files Not Loading

**Issue**: Audio files return 404
**Solution**: 
- Check file paths are correct
- Verify MIME types on server
- Check CORS headers

### Performance Issues on Production

**Issue**: Site slow on production
**Solution**:
- Enable gzip compression
- Minimize JavaScript/CSS
- Use CDN for static files
- Reduce particle count

### White Screen of Death

**Issue**: Blank page on load
**Solution**:
- Check console errors
- Verify all JS libraries loaded
- Check browser WebGL support
- Test in different browser

## Rollback Plan

If deployment fails:

1. **With Git**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **With Netlify**
   - Go to Deploys
   - Click previous successful deploy
   - Click "Publish Deploy"

3. **With S3**
   ```bash
   aws s3 sync s3://backup-bucket s3://live-bucket
   ```

## Post-Deployment Checklist

- [ ] Test all features on live site
- [ ] Test across browsers
- [ ] Test on mobile devices
- [ ] Verify audio is working
- [ ] Check performance metrics
- [ ] Monitor error logs
- [ ] Share with Megha!
- [ ] Monitor analytics

---

**Recommended**: Use Netlify for easiest, fastest deployment with automatic HTTPS and CDN.

**Support**: For deployment issues, consult platform-specific documentation or contact platform support.
