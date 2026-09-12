# 🌗 Dark/Light Mode Implementation

## What Was Added

### 1. **Theme Provider** (`/providers/theme-provider.tsx`)
- Creates a React Context for managing theme state
- Stores theme preference in localStorage
- Respects system preferences on first load
- Automatically applies theme to `<html>` element (adds/removes `dark` class)
- No flash of unstyled content (FOUC)

### 2. **Theme Toggle Component** (`/components/theme-toggle.tsx`)
- Beautiful icon button with animated transitions
- Shows Sun icon in light mode ☀️
- Shows Moon icon in dark mode 🌙
- Icons smoothly rotate and scale when switching
- Uses Remixicon icons: `RiSunLine` and `RiMoonLine`
- Displays "Light" or "Dark" label on desktop (hidden on mobile)
- Positioned in header for quick access

### 3. **Updated Layout** (`/app/layout.tsx`)
- Wrapped with `<ThemeProvider>`
- Added `suppressHydrationWarning` to prevent hydration mismatch
- Body has `transition-colors` class for smooth color changes
- Automatic background and text color updates

### 4. **Updated All Pages**
- **Home** (`/app/page.tsx`) - Theme toggle in header
- **Gallery** (`/app/decks/page.tsx`) - Theme toggle in header
- **Deck Viewer** (`/app/deck/[id]/page.tsx`) - Theme toggle in header

### 5. **Color Scheme**

#### Light Mode
```
Background: white (bg-white)
Text: black (text-black)
Cards: zinc-100 (light gray)
Borders: zinc-300 (light gray borders)
Accent: blue-600 (bright blue buttons)
Status Colors:
  - Pending: zinc-300
  - Generating: blue-300
  - Completed: green-300
  - Failed: red-300
```

#### Dark Mode
```
Background: black (bg-black)
Text: white (text-white)
Cards: zinc-900 (dark gray)
Borders: zinc-800 (dark borders)
Accent: blue-600 (same blue buttons)
Status Colors:
  - Pending: zinc-700
  - Generating: blue-900
  - Completed: green-900
  - Failed: red-900
```

## How It Works

### Theme Storage Flow
```
User clicks Theme Toggle
    ↓
toggleTheme() called
    ↓
Theme state updated in Context
    ↓
CSS class applied to <html> element
    ↓
Tailwind CSS reacts to dark class selector
    ↓
All dark: prefixed styles activate
    ↓
Theme saved to localStorage
    ↓
Persists across sessions
```

### Persistence
- Theme preference saved in localStorage as `"theme": "light" | "dark"`
- On page load, retrieves saved theme
- Falls back to system preference if nothing saved
- Updates immediately without page reload

## Component Tree

```
<html> (dark class added/removed)
  ↓
<body> (transition-colors)
  ↓
<ThemeProvider>
  ↓
All Pages/Components
  ├── Header
  │   └── ThemeToggle (🌙 or ☀️)
  └── Content (with dark: prefixed Tailwind classes)
```

## Icon Details

### Remixicon Icons Used
- `RiSunLine` - Light mode icon ☀️
- `RiMoonLine` - Dark mode icon 🌙

### Animations
- **Rotation**: ±90° on switch
- **Scale**: 0% → 100% on switch
- **Duration**: 300ms smooth transition
- **Easing**: Built-in Tailwind transitions

## Tailwind Configuration

The app uses Tailwind's built-in dark mode with the `class` strategy:
```
dark:bg-black       (only apply in dark mode)
dark:text-white     (only apply in dark mode)
bg-white            (light mode)
text-black          (light mode)
```

When the `dark` class is on `<html>`, all `dark:` prefixed utilities activate.

## Usage Example

Any component can now use dark mode:
```tsx
<div className="bg-white dark:bg-black text-black dark:text-white">
  Light mode: white background, dark text
  Dark mode: black background, white text
</div>
```

## Features

✅ **System Preference Detection** - Respects OS dark mode setting
✅ **Persistent Storage** - Remembers user choice
✅ **Smooth Transitions** - 300ms animations on switch
✅ **No Flash** - HTML has suppressHydrationWarning
✅ **Accessible** - Button has proper ARIA labels
✅ **Mobile Optimized** - Label hidden on small screens
✅ **Consistent Colors** - Light/dark palette across all pages
✅ **Icon Animations** - Beautiful rotating icon transitions

## Testing Light/Dark Mode

1. **Click the theme toggle button** (☀️ or 🌙 icon in header)
2. **Page instantly switches** between light and dark
3. **Refresh the page** - theme preference persists
4. **Try on different pages** - works on all pages
5. **Check localStorage** - open DevTools → Application → localStorage → see `"theme"` key

## Browser Support

- ✅ All modern browsers
- ✅ localStorage support required
- ✅ CSS custom properties support
- ✅ CSS class-based dark mode

## Future Enhancements

Optional additions:
- Add theme scheduling (auto-switch at certain times)
- Add more color schemes (not just light/dark)
- Add accessibility preferences
- Add theme option to user profile (when auth is added)
