## Dashboard Builder

A drag-and-drop dashboard builder built with React and Vite. Create custom dashboards using a library of widgets (charts, KPI cards, tables), arrange them on a responsive grid, preview the result, and export reusable code.

![Dashboard Builder](./src/assets/man.png)

### Highlights

- **Drag & drop layout**: Powered by `react-grid-layout` with resize and move support
- **Widget library**: Line, Bar, Area, Pie, Funnel, KPI Card, Data Table
- **Keyboard shortcuts**: Undo/redo, duplicate, move, delete, toggle grid/properties, and more
- **Preview & export**: Live preview modal and code export helpers
- **Theme support**: Light/dark via app `ThemeContext`
- **Responsive**: Grid-based layout scales across screen sizes

### Tech Stack

- **React 19** + **Vite 7**
- **Tailwind CSS 4**
- **react-dnd** + **react-grid-layout**
- **react-router-dom 7**
- **recharts** for sample charts
- **react-icons**

## Getting Started

### Prerequisites

- Node.js v18+ and npm (or yarn/pnpm)

### Install and run

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and navigate to `/dashboard-builder` to use the builder.

### Build for production

```bash
npm run build
```

Artifacts will be generated in the `dist/` directory. Preview with:

```bash
npm run preview
```

## Usage

1. Go to the builder at `/dashboard-builder`.
2. Drag widgets from the palette onto the canvas, or click the quick-add button on the canvas.
3. Click a widget to select it and edit properties in the right panel (title, color, size, etc.).
4. Resize or drag widgets to rearrange; use controls to duplicate, lock, or delete.
5. Use Preview to see a modal of the dashboard; use Export to generate code you can copy.

### Keyboard Shortcuts

- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y** or **Ctrl/Cmd + Shift + Z**: Redo
- **Ctrl/Cmd + S**: Save (placeholder)
- **Ctrl/Cmd + E**: Export
- **Ctrl/Cmd + P**: Preview
- **Ctrl/Cmd + A**: Select all
- **Ctrl/Cmd + D**: Duplicate selected widget
- **Ctrl/Cmd + C / V**: Copy / Paste widget
- **Ctrl/Cmd + G**: Toggle grid
- **Ctrl/Cmd + I**: Toggle properties panel
- **Delete / Backspace**: Delete selected widget
- **Escape**: Deselect
- **Arrow keys**: Move selected widget (hold Shift for larger steps)

## Project Structure

```
src/
├── App.jsx                          # App shell and routes (`/dashboard-builder`)
├── context/ThemeContext.jsx         # Theme provider (light/dark)
├── pages/DashboardBuilder/
│   ├── index.jsx                    # Builder page wrapper
│   ├── context/BuilderContext.jsx   # Core state: widgets, history, actions
│   ├── hooks/
│   │   ├── useGridLayout.js         # Grid helpers and RGL integration
│   │   └── useKeyboardShortcuts.js  # Global keyboard handling
│   ├── components/
│   │   ├── Canvas.jsx               # Canvas with `react-grid-layout`
│   │   ├── ComponentPalette.jsx     # Draggable widget palette (react-dnd)
│   │   ├── WidgetControls.jsx       # Actions (duplicate, lock, delete)
│   │   ├── PropertiesPanel/         # General/Style/Data/KPI panels
│   │   ├── PreviewModal/            # Preview modal
│   │   ├── ExportDialog.jsx         # Export UI
│   │   └── widgets/                 # Widget implementations
│   └── utils/                       # Grid, export, code, mock data helpers
└── styles/                          # Global and grid styles
```

## Scripts

- `npm run dev`: Start dev server
- `npm run build`: Production build
- `npm run preview`: Preview built app
- `npm run lint`: Run ESLint

## Notes

- The export functionality uses helpers in `src/pages/DashboardBuilder/utils/`; adapt code generation to your target framework as needed.
- Routes are defined in `src/App.jsx`. The builder is accessible at `/dashboard-builder`.

## Acknowledgments

- `react-grid-layout`, `react-dnd`, and `recharts` for the ecosystem building blocks
- `react-icons` for icons