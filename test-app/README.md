# Dashboard Test App 🧪

A simple React test environment for testing exported dashboard components from the Dashboard Builder.

## Features

- **Live Code Testing**: Paste your exported code and see it render immediately
- **Theme Support**: Test both light and dark themes
- **Error Handling**: Clear error messages for debugging
- **Sample Code**: Includes a sample dashboard to get started
- **Real-time Preview**: See exactly how your dashboard will look in production

## Quick Start

1. **Install dependencies:**
   ```bash
   cd test-app
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   The app will automatically open at `http://localhost:3001`

## How to Use

1. **Export from Dashboard Builder:**
   - Create a dashboard in the main Dashboard Builder
   - Click the "Export" button
   - Copy the generated code

2. **Test in this app:**
   - Paste the code in the Code Editor
   - Click "Test Dashboard"
   - View your dashboard with proper styling

3. **Verify functionality:**
   - Test different themes (light/dark)
   - Check that all widgets render correctly
   - Verify data displays properly

## Supported Features

✅ **All widget types** (Charts, KPI cards, Tables, etc.)  
✅ **Theme switching** (Light/Dark modes)  
✅ **Row-based layouts**  
✅ **Professional widgets**  
✅ **Responsive design**  
✅ **Error boundaries** for debugging  

## File Structure

```
test-app/
├── src/
│   ├── components/
│   │   ├── CodeEditor.jsx      # Code input interface
│   │   └── TestDashboard.jsx   # Dashboard renderer
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # Entry point
│   └── index.css              # Styling with dashboard CSS
├── package.json               # Dependencies
└── README.md                  # This file
```

## Troubleshooting

**Dashboard not rendering?**
- Check that you copied the complete exported code
- Ensure all import statements are included
- Check the browser console for errors

**Styling looks different?**
- Make sure Tailwind CSS is working
- Check that CSS variables are loaded
- Try switching themes to verify theme support

**Import errors?**
- The test app includes all necessary dependencies
- React and Recharts are pre-configured
- Component processing handles import conflicts

## Dependencies

- **React 19** - UI framework
- **Recharts 3** - Chart library  
- **Tailwind CSS 4** - Styling
- **Vite 7** - Build tool

This test app provides a production-like environment to verify your exported dashboards work perfectly! 🚀
