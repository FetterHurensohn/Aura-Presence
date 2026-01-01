# Aura Presence Design System

Vollständiges Design-System für Aura Presence mit 25+ Production-Ready Components.

## 📁 Struktur

```
design-system/
├── tokens.json          # Design-Tokens (Farben, Typography, Spacing, etc.)
├── animations.js        # Animation Utilities & Keyframes
├── components/          # Wiederverwendbare React-Components
│   ├── index.js        # Barrel Exports
│   ├── Container.jsx   # Layout Components
│   ├── Grid.jsx
│   ├── Stack.jsx
│   ├── Sidebar.jsx
│   ├── AppLayout.jsx
│   ├── Button.jsx      # Form Components
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── Checkbox.jsx
│   ├── Switch.jsx
│   ├── Card.jsx        # Data Display
│   ├── Badge.jsx
│   ├── Avatar.jsx
│   ├── Divider.jsx
│   ├── Alert.jsx       # Feedback Components
│   ├── Toast.jsx
│   ├── Progress.jsx
│   ├── Skeleton.jsx
│   ├── EmptyState.jsx
│   ├── NavBar.jsx      # Navigation
│   ├── Tabs.jsx
│   ├── Dropdown.jsx
│   ├── Modal.jsx       # Overlays
│   ├── Tooltip.jsx
│   ├── Icon.jsx        # Utilities
│   ├── Spinner.jsx
│   └── Transition.jsx
├── index.js            # Main Export
└── README.md           # Diese Datei
```

## 🎨 Design-Tokens

Alle Design-Tokens sind in `tokens.json` definiert und in `tailwind.config.js` integriert.

### Farben

- **bg-900**: #0B0B0D (Haupt-Hintergrund)
- **surface-800**: #121217 (Cards, Panels)
- **accent-500**: #8A63FF (Primärer Lila-Akzent)
- **cyan**: #00E5FF (Video/Camera Icons)
- **success**: #44FF9E (Success States)
- **danger**: #FF5757 (Errors)

### Typography

- **text-h1**: 36px, 600 (Hauptüberschriften)
- **text-h2**: 28px, 600 (Sektionsüberschriften)
- **text-h3**: 20px, 600 (Unterüberschriften)
- **text-body**: 16px, 400 (Fließtext)
- **text-small**: 12px, 400 (Kleinerer Text)
- **text-caption**: 10px, 600 (Labels)

### Spacing

8px-basiertes System: `1` (4px), `2` (8px), `3` (12px), `4` (16px), `6` (24px), `8` (32px), `12` (48px), etc.

## 🧩 Components

### Import

```jsx
// Einzelne Components
import { Button, Input, Card, Alert } from '@/design-system/components';

// Alles
import * as DS from '@/design-system';
```

### Kategorien

**Layout:** Container, Grid, Stack, Sidebar, AppLayout  
**Forms:** Button, Input, Select, Checkbox, Switch  
**Data Display:** Card, Badge, Avatar, Divider  
**Feedback:** Alert, Toast, Progress, Skeleton, EmptyState  
**Navigation:** NavBar, Tabs, Dropdown  
**Overlays:** Modal, Tooltip  
**Utilities:** Icon, Spinner, Transition

### Quick Examples

**Button:**
```jsx
<Button variant="primary" icon="check" loading={isLoading}>
  Speichern
</Button>
```

**Input:**
```jsx
<Input 
  label="E-Mail" 
  type="email" 
  error={errors.email}
  icon="user"
/>
```

**Card Grid:**
```jsx
<Grid cols={3} gap={6}>
  <Card>Content 1</Card>
  <Card>Content 2</Card>
  <Card>Content 3</Card>
</Grid>
```

**Alert:**
```jsx
<Alert variant="success" dismissible>
  Erfolgreich gespeichert!
</Alert>
```

**Page Layout:**
```jsx
<AppLayout navbar={<NavBar />} sidebarItems={navItems}>
  <Container>
    <h1>Meine Seite</h1>
    <PageContent />
  </Container>
</AppLayout>
```

## 🎭 Animations

```jsx
import { animations } from '@/design-system';

<div className={animations.fadeIn}>
  Content fades in
</div>

<Transition show={isOpen} animation="slideInUp">
  <Modal />
</Transition>
```

## 📚 Dokumentation

- **Design Tokens:** `docs/DESIGN_TOKENS.md`
- **Components:** `docs/COMPONENTS.md`
- **Playground:** `/design-system` Route (Development)

## 🎨 Design Playground

Besuche `/design-system` im Development-Mode für einen interaktiven Playground:

```bash
npm run dev
# Navigate to http://localhost:5173/design-system
```

## ✨ Features

- ✅ 25+ Production-Ready Components
- ✅ Vollständig TypeScript-kompatibel (JSDoc)
- ✅ Accessibility (WCAG AA)
- ✅ Responsive Design
- ✅ Dark Theme optimiert
- ✅ Animation System
- ✅ Tailwind CSS Integration
- ✅ Barrel Exports für einfache Imports

## 🚀 Getting Started

1. **Import Components:**
```jsx
import { Button, Card, Input } from '@/design-system/components';
```

2. **Use Design Tokens:**
```jsx
<div className="bg-bg-900 p-4 rounded-card shadow-md">
  <h1 className="text-h1 text-white">Hello</h1>
</div>
```

3. **Apply Animations:**
```jsx
import { animations } from '@/design-system';

<div className={animations.fadeIn}>
  Animated content
</div>
```

## 📝 Naming Conventions

- **Components:** PascalCase (`Button`, `NavBar`)
- **Props:** camelCase (`variant`, `onClick`)
- **CSS Classes:** Tailwind utilities
- **Files:** PascalCase für Components (`Button.jsx`)

## 🔄 Changelog

### Version 1.0 (31.12.2024)
- ✅ Initial Release
- ✅ 25+ Components
- ✅ Design Tokens System
- ✅ Animation System
- ✅ Complete Documentation
- ✅ Interactive Playground

