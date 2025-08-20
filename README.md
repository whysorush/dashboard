# Stack Logix Dashboard

A modern, responsive admin dashboard built with React and Vite, featuring a beautiful dark/light theme, interactive charts, and real-time data visualization.

![Stack Logix Dashboard](./src/assets/man.png)

## Features

- 🌓 Dark/Light Theme Support
- 📊 Interactive Charts (using Recharts)
- 📱 Fully Responsive Design
- 🎯 Real-time Data Visualization
- 🔍 Search Functionality
- 🎨 Modern UI/UX
- 📊 Data Tables
- 🎛️ Advanced Filters

## Tech Stack

- React 19
- Vite 7
- Tailwind CSS 4
- React Icons
- Recharts
- Modern CSS (CSS Variables, Grid, Flexbox)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/stacklogix-Dashboard.git
cd stacklogix-Dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
stacklogix-Dashboard/
├── src/
│   ├── components/         # React components
│   ├── context/           # React context (theme, etc.)
│   ├── assets/           # Images and static assets
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── public/               # Public assets
└── package.json         # Project dependencies and scripts
```

## Features in Detail

### Theme Support
- Seamless dark/light mode switching
- Persistent theme preference
- CSS variables for consistent theming
- Smooth theme transitions

### Components
- **StatCards**: Display key metrics with icons
- **Charts**: Interactive bar and funnel charts
- **DataTable**: Sortable and filterable data grid
- **Filters**: Advanced filtering options
- **Sidebar**: Responsive navigation menu
- **Header**: Search and user profile section

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Collapsible sidebar
- Responsive data visualization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React Icons for the beautiful icon set
- Recharts for the charting library
- Tailwind CSS for the utility-first CSS framework