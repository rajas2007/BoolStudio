# Deployment Guide

Instructions on how to build, test, and release BoolStudio.

---

## 🛠️ Local Development Build
To run and test the application locally:
```bash
# Install dependencies
npm install

# Run the local development server
npm run dev
```

## 📦 Production Builds
To bundle the application for production hosting:
```bash
# Run build command
npm run build
```
Outputs are compiled into the `/dist` or `/out` directory.

## 🚀 Deployment Platforms
* **Static Hosting**: Upload build folder output directly to GitHub Pages, Netlify, Vercel, or Firebase Hosting.
