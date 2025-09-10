#!/bin/bash

echo "🚀 Starting Dashboard Builder Test Environment"
echo ""

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Start main dashboard builder if not running
if ! check_port 5173; then
    echo "📊 Starting Dashboard Builder (main app) on port 5173..."
    cd /home/rushabh/projects/stacklogix_dashboard_builder
    npm run dev &
    MAIN_PID=$!
    sleep 3
else
    echo "✅ Dashboard Builder already running on port 5173"
fi

# Start test app if not running
if ! check_port 3000; then
    echo "🧪 Starting Test App on port 3000..."
    cd /home/rushabh/projects/stacklogix_dashboard_builder/test-app
    npm run dev &
    TEST_PID=$!
    sleep 3
else
    echo "✅ Test App already running on port 3000"
fi

echo ""
echo "🎉 Both apps are now running!"
echo ""
echo "📋 Quick Test Instructions:"
echo "1. 🔗 Open Dashboard Builder: http://localhost:5173/dashboard-builder"
echo "2. ➕ Create a dashboard with some widgets"
echo "3. 📤 Click 'Export' and copy the generated code"
echo "4. 🔗 Open Test App: http://localhost:3000"
echo "5. 📋 Paste your code and click 'Test Dashboard'"
echo "6. 👀 Verify the styling matches exactly!"
echo ""
echo "💡 Pro tip: Try different export options (JSX/JS, styling modes)"
echo ""
echo "🛑 To stop both apps: killall node"
echo ""
