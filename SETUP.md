# Setup Guide - Find My VPP

Quick start guide to get the project running locally.

## Prerequisites

Before starting, ensure you have:
- **Node.js**: Version 14 or higher
- **npm**: Version 6 or higher (comes with Node.js)
- **Git**: For version control (optional)
- **Code Editor**: VS Code recommended

### Check Installation

```bash
# Check Node.js version
node --version  # Should be v14+

# Check npm version
npm --version   # Should be v6+
```

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd "Find-My-VPP"
```

### 2. Install Dependencies

```bash
npm install
```

This will:
- Download React and dependencies
- Install the React build tools
- Create `node_modules/` folder
- Generate `package-lock.json`

### 3. Environment Configuration (Optional)

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_ENDPOINT=/api/chat

# Other settings
REACT_APP_ENV=development
```

**Note:** The application uses a proxy configured in `package.json`, so API calls to `/api/chat` will be forwarded to the backend.

## Running the Application

### Development Mode

```bash
npm start
```

This will:
- Start the development server
- Open http://localhost:3000 in your default browser
- Enable hot module reloading
- Show compilation errors in the terminal

**Expected Output:**
```
Compiled successfully!

You can now view car-advisor-ui in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### Building for Production

```bash
npm run build
```

This will:
- Create an optimized production build
- Output to `build/` folder
- Minify and optimize code
- Generate source maps

**Output:**
```
The build folder is ready to be deployed.
Find the build instructions for your hosting provider.
```

### Running Tests

```bash
npm test
```

Launches the test runner in interactive mode.

## Backend API Setup

The application requires a backend API server running on `http://localhost:3001` by default.

### Configure Backend URL

If your backend runs on a different port, update `package.json`:

```json
{
  "proxy": "http://localhost:YOUR_PORT"
}
```

**Note:** You'll need to restart the development server after changing the proxy.

## Project Structure

```
Find-My-VPP/
├── node_modules/           # Installed dependencies (auto-created)
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/         # React components
│   │   ├── Chat.js
│   │   ├── ChatMessage.js
│   │   ├── Chat.css
│   │   ├── ChatMessage.css
│   │   ├── ProductCard.js
│   │   ├── ProductCard.css
│   │   ├── Recommendations.js
│   │   ├── TypingIndicator.js
│   │   ├── TypingIndicator.css
│   │   ├── LoadingSpinner.js
│   │   └── LoadingSpinner.css
│   ├── App.js              # Main component
│   ├── App.css             # Main styles
│   ├── index.js            # React entry point
│   └── index.css           # Global styles
├── build/                  # Production build (after npm run build)
├── package.json            # Project configuration
├── package-lock.json       # Dependency lock file (auto-created)
├── README.md               # Project documentation
├── SETUP.md                # This file
├── API_EXAMPLES.md         # API integration examples
└── DEVELOPMENT_GUIDE.md    # Technical documentation
```

## Verification Checklist

After installation, verify everything is working:

- [ ] `npm install` completed without errors
- [ ] `npm start` launches without errors
- [ ] Application opens at `http://localhost:3000`
- [ ] UI loads correctly with no console errors
- [ ] Chat section displays with empty state
- [ ] Input field is functional
- [ ] Can type and interact with the interface

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# On macOS/Linux
lsof -i :3000
kill -9 <PID>

# Or let React choose a different port
# You'll be prompted to use port 3001
```

### Node Modules Issues

If you encounter module errors:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS or API Errors

If you see CORS errors:

1. Ensure backend API is running on the configured port
2. Check the proxy setting in `package.json`
3. Verify backend has CORS headers configured
4. Check browser console for detailed error messages

### Build Errors

If `npm build` fails:

```bash
# Check for compilation errors
npm run build -- --verbose

# Ensure all imports are correct
# Check for missing files or typos
```

## Development Workflow

### Making Changes

1. Edit files in `src/` folder
2. Save the file
3. Development server auto-reloads
4. Check browser for changes

### Adding New Components

1. Create file: `src/components/NewComponent.js`
2. Create styles: `src/components/NewComponent.css`
3. Import in parent: `import NewComponent from './components/NewComponent'`
4. Use in JSX: `<NewComponent />`

### Debugging

**Browser DevTools:**
```
Right-click → Inspect
- Console tab: See logs and errors
- Network tab: Monitor API calls
- React DevTools: Install extension for component inspection
```

**Terminal:**
- Compilation errors appear in terminal
- npm will show warnings and errors

## Production Deployment

### Build the Application

```bash
npm run build
```

### Deploy Built Files

The `build/` folder contains:
- `index.html` - Main HTML file
- `static/js/` - JavaScript bundles
- `static/css/` - CSS files
- `asset-manifest.json` - Asset mapping

### Deploy to Hosting

Common deployment options:

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Netlify**
- Connect GitHub repository
- Set build command: `npm run build`
- Set publish directory: `build`

**Traditional Hosting**
- Upload `build/` folder to web server
- Configure web server for SPA routing
- Ensure API endpoint is correctly configured

### Configure API in Production

Update the proxy or API URL in production:

```bash
# Set environment variable before build
REACT_APP_API_URL=https://api.yourdomain.com npm run build
```

## Performance Tips

### Development

- Use Chrome DevTools Performance tab
- Profile React components with React DevTools
- Monitor network requests in Network tab

### Production

- Use production builds (npm run build)
- Enable browser caching
- Use CDN for static files
- Optimize images
- Monitor with analytics tools

## Getting Help

### Resources

1. **Documentation Files:**
   - `README.md` - Project overview
   - `DEVELOPMENT_GUIDE.md` - Technical details
   - `API_EXAMPLES.md` - API integration

2. **External Resources:**
   - React Docs: https://react.dev
   - MDN Web Docs: https://developer.mozilla.org
   - Stack Overflow: Tag questions with `reactjs`

3. **Browser Console**
   - Check for error messages
   - See API request/response data
   - Debug component issues

## Next Steps

After successful setup:

1. Review `README.md` for feature overview
2. Check `API_EXAMPLES.md` for API integration
3. Read `DEVELOPMENT_GUIDE.md` for architecture
4. Start the application with `npm start`
5. Test the conversational flow
6. Verify API integration with backend

## Useful Commands

```bash
# Start development server
npm start

# Create production build
npm run build

# Run tests
npm test

# Clean cache and reinstall
rm -rf node_modules && npm install

# Check for outdated packages
npm outdated

# Update packages
npm update
```

## Version Information

- **Node.js**: 14.0.0 or higher
- **npm**: 6.0.0 or higher
- **React**: 18.2.0
- **React-DOM**: 18.2.0
- **React-Scripts**: 5.0.1

---

**Setup Complete!** You're ready to start developing. Run `npm start` to launch the application.
