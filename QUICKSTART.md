# Quick Start - Find My VPP

Get the application running in 5 minutes!

## 1️⃣ Prerequisites Check

```bash
# Verify Node.js is installed
node --version    # Should show v14 or higher

# Verify npm is installed  
npm --version     # Should show v6 or higher
```

## 2️⃣ Install Dependencies

```bash
# Navigate to the project
cd "Find-My-VPP"

# Install all dependencies
npm install

# Takes ~2-3 minutes depending on internet speed
```

## 3️⃣ Start the Application

```bash
npm start
```

The app will automatically open at **http://localhost:3000**

**What to see:**
- Find My VPP header
- Chat window on the left
- Recommendations panel on the right (empty initially)
- Welcome message with first question

## 4️⃣ Test the Application

1. **Type a response** to the welcome question
2. **Click Send** button
3. **Check the console** (F12) for any errors
4. **Verify API integration** (if backend is running)

## 📁 Project Files Overview

```
Find-My-VPP/
├── src/components/     → React components
├── src/App.js          → Main application
├── src/App.css         → Styles
├── public/index.html   → HTML template
└── package.json        → Dependencies
```

## 🚀 Common Commands

```bash
npm start       # Run development server (port 3000)
npm build       # Create production build
npm test        # Run tests
npm run build   # Build optimized production version
```

## 🔌 API Configuration

If your backend API runs on a different port, edit `package.json`:

```json
{
  "proxy": "http://localhost:YOUR_PORT"
}
```

Then restart the dev server.

## ⚙️ Key Features

- ✅ **Two-column layout** - Chat on left, products on right
- ✅ **Conversational AI** - 5-6 question flow
- ✅ **Product recommendations** - AI-powered personalization
- ✅ **Selection management** - Select/deselect products
- ✅ **Fully responsive** - Works on desktop, tablet, mobile
- ✅ **Modern UI** - Enterprise SaaS design aesthetic

## 🎯 User Flow

1. App loads with welcome message
2. User answers conversational questions
3. AI generates personalized recommendations
4. Product cards appear on the right
5. User selects preferred products
6. Selected products summary shows total cost

## 📚 Documentation

- **README.md** - Complete feature documentation
- **SETUP.md** - Detailed setup instructions
- **DEVELOPMENT_GUIDE.md** - Architecture & code patterns
- **API_EXAMPLES.md** - API integration examples
- **PROJECT_STRUCTURE.md** - File organization

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Let React assign a different port
# When prompted, type "Y" to use port 3001
```

### npm install fails
```bash
npm cache clean --force
npm install
```

### Styles not loading
- Clear browser cache (Ctrl+Shift+Delete)
- Restart the development server

### API errors
- Verify backend server is running on configured port
- Check console (F12) for error details
- Review API endpoint configuration

## 🎓 Next Steps

1. ✅ Start the app with `npm start`
2. ✅ Test the conversational flow
3. ✅ Review code structure in `src/components/`
4. ✅ Read DEVELOPMENT_GUIDE.md for architecture details
5. ✅ Set up API integration with your backend
6. ✅ Customize to your needs

## 📞 Support Resources

**Having Issues?**
1. Check the browser console (F12)
2. Read TROUBLESHOOTING section in SETUP.md
3. Review DEVELOPMENT_GUIDE.md technical details
4. Check API_EXAMPLES.md for integration help

## 🎨 Customize

### Change Colors
Edit `src/App.css` - look for color definitions:
```css
Primary Blue: #3b82f6
Dark Text: #111827
Light Text: #6b7280
```

### Modify Layout
Update `src/App.css` grid layout:
```css
.app-layout {
  grid-template-columns: 1fr 1fr;  /* Change ratio here */
}
```

### Update Questions
Edit `src/App.js` - modify INITIAL_QUESTIONS array

### Adjust Styling
Each component has its own CSS file in `src/components/`

---

**Ready to go!** Run `npm start` and start developing.

For detailed information, refer to the documentation files included in the project.
