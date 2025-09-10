#!/bin/bash

echo "🧪 Setting up Dashboard Test App..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the test-app directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup complete!"
    echo ""
    echo "🚀 To start the test app:"
    echo "   npm run dev"
    echo ""
    echo "📖 The app will open at http://localhost:3001"
    echo ""
    echo "💡 How to use:"
    echo "   1. Go to your Dashboard Builder"
    echo "   2. Export a dashboard component"
    echo "   3. Paste the code in the test app"
    echo "   4. Click 'Test Dashboard'"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check your npm configuration."
    exit 1
fi
