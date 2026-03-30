# AWS S3 + CloudFront Deployment Guide

## Overview
Digi Sanctuary is a React SPA and PWA built with Vite. Deploying it to AWS requires:
1. An S3 Bucket for static file hosting.
2. A CloudFront Distribution to serve content globally over HTTPS.
3. Special Cache-Control strategies to ensure users always receive the latest `index.html` and `sw.js`, while static assets are cached for a year.

## 1. S3 Bucket Configuration
1. Create an S3 Bucket (e.g., `digi-sanctuary-app`).
2. Disable "Block all public access" if using Origin Access Control (OAC), or keep it disabled and apply a Bucket Policy. (Using OAC is recommended).
3. Ensure Static Website Hosting is **enabled** with `index.html` as the index document.

## 2. CloudFront Distribution
1. Create a new CloudFront distribution.
2. Set the Origin to your S3 bucket.
3. Enable **Origin Access Control (OAC)** to secure the bucket so only CloudFront can access it. Update the S3 bucket policy as prompted by CloudFront.
4. **Viewer Protocol Policy**: Redirect HTTP to HTTPS.

### Custom Error Responses (Required for React Router)
Because this is a Single Page Application (SPA), navigating directly to `/settings` will result in a 404 from S3.
1. In the CloudFront distribution, go to the **Error pages** tab.
2. Create a custom error response for `404 Not Found`:
   - Customize error response: **Yes**
   - Response page path: `/index.html`
   - HTTP Response code: **200: OK**
3. Create a custom error response for `403 Forbidden` (S3 sometimes returns 403 instead of 404):
   - Customize error response: **Yes**
   - Response page path: `/index.html`
   - HTTP Response code: **200: OK**

## 3. Cache-Control Strategy
To leverage the PWA Service Worker effectively, we must manage caching headers at the S3 level (via our CI/CD pipeline):

- **Static Assets (JS/CSS/Fonts/Images)**: These are hashed by Vite.
  - `Cache-Control: max-age=31536000, immutable`
- **Entry Points (`index.html` and `sw.js`)**: These must never be cached by the CDN or browser so users always download the latest application shell and Service Worker logic.
  - `Cache-Control: no-cache, no-store, must-revalidate`

## 4. GitHub Actions CI/CD
The repository includes a GitHub Actions workflow `.github/workflows/deploy.yml` which automates the build, sets the correct `Cache-Control` headers during the S3 sync, and invalidates the CloudFront cache.

### Required GitHub Secrets
You must configure the following secrets in your GitHub repository setting (Settings > Secrets and variables > Actions):
- `AWS_ACCESS_KEY_ID`: IAM user with S3 Sync and CloudFront Invalidation permissions.
- `AWS_SECRET_ACCESS_KEY`: IAM user secret key.
- `S3_BUCKET`: The name of your S3 bucket.
- `CLOUDFRONT_DISTRIBUTION_ID`: The ID of your CloudFront distribution (e.g., `E1XXXXXXX`).
