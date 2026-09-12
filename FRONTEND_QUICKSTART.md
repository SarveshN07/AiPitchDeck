# 🚀 Frontend Quick Start Guide

## What Was Built

A complete frontend for your Pitch Deck AI application with:

1. **Landing Page** - Hero section with deck creation form
2. **Deck Gallery** - View all your created decks with real-time status
3. **Deck Viewer** - Beautiful carousel to view slides one at a time
4. **Real-time Polling** - Tracks generation progress via Inngest status
5. **Full CRUD** - Create, read, and delete decks

---

## 📁 File Locations

### Pages (Routes)
| Route | File | Purpose |
|-------|------|---------|
| `/` | `/app/page.tsx` | Landing page with create form |
| `/decks` | `/app/decks/page.tsx` | Gallery of all decks |
| `/deck/[id]` | `/app/deck/[id]/page.tsx` | Deck viewer with carousel |

### API Endpoints
| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/decks` | Create new deck (triggers Inngest) |
| GET | `/api/decks` | List all decks |
| GET | `/api/decks/[id]` | Get deck with slides |
| DELETE | `/api/decks/[id]` | Delete deck |

### Components
```
/components/
├── create-deck-form.tsx   (Form to input business idea)
├── deck-card.tsx          (Card showing deck info)
└── slide-carousel.tsx     (Horizontal slide viewer)

/hooks/
└── use-deck-status.ts     (Real-time polling hook)
```

---

## 🎯 How It Works

### **Step 1: User Creates Deck**
```
Landing Page (/page.tsx)
    ↓
User types business idea
    ↓
Click "Create Pitch Deck"
    ↓
POST /api/decks { idea: "..." }
```

### **Step 2: Backend Processes**
```
API Route (/api/decks)
    ↓
Create Deck in DB (status: PENDING)
    ↓
Send Inngest Event { deckId, event: "deck/generate" }
    ↓
Return deck ID to frontend
```

### **Step 3: Real-time Updates**
```
Redirect to /deck/[id]
    ↓
useDeckStatus Hook starts polling
    ↓
Every 2 seconds: GET /api/decks/[id]
    ↓
Status updates: PENDING → GENERATING → COMPLETED
    ↓
Display slides in carousel when COMPLETED
```

---

## 🎨 UI Features

### Status Indicators
- 🔵 **PENDING** (Gray) - Waiting to start
- 🔵 **GENERATING** (Blue) - Creating content & images
- 🟢 **COMPLETED** (Green) - Ready to view
- 🔴 **FAILED** (Red) - Error occurred

### Slide Carousel
- **One slide at a time** horizontal view
- **Auto-advance** every 8 seconds (pauses on hover)
- **Manual navigation** with arrow buttons
- **Thumbnail strip** to jump to any slide
- **Slide details** showing title, content, image prompt
- **Progress bar** at bottom showing position

### Gallery Features
- **Real-time polling** - Updates every 5 seconds
- **Status badges** - See generation progress
- **Error messages** - Shows if generation failed
- **Empty state** - Helpful message when no decks

---

## 🔌 Integration with Inngest

### Event Triggered
When user creates a deck, the frontend sends an **Inngest event**:

```javascript
// Triggered in POST /api/decks
await inngest.send({
  name: "deck/generate",
  data: { deckId: "..." }
});
```

### Status Tracking
The backend updates deck status as it processes:
1. **PENDING** - Initial state
2. **GENERATING** - Running agent & generating images
3. **COMPLETED** - All slides created (saves to DB)
4. **FAILED** - Error occurred (saves error message)

### Frontend Polling
The `useDeckStatus` hook continuously checks:
```javascript
GET /api/decks/[id]
→ Returns: { status, slides[], errorMessage, ... }
```

---

## 🛠️ Running the Application

### Development
```bash
pnpm dev
```
Then visit: **http://localhost:3000**

### Production Build
```bash
pnpm build
pnpm start
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────┐
│  User Input (Business Idea)             │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  CreateDeckForm Component               │
│  (Validates & sends POST)               │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  POST /api/decks                        │
│  • Create deck in DB (PENDING)          │
│  • Send Inngest event                   │
│  • Return deckId                        │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Redirect to /deck/[id]                 │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  Deck Viewer Page                       │
│  • Load deck info                       │
│  • Show loading state                   │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│  useDeckStatus Hook (Polling)           │
│  • GET /api/decks/[id] every 2 seconds  │
│  • Track: PENDING→GENERATING→COMPLETED  │
└──────────────┬──────────────────────────┘
               │
               ├→ If COMPLETED
               │   └→ Display SlideCarousel with all slides
               │
               ├→ If GENERATING
               │   └→ Show loading spinner & progress bar
               │
               └→ If FAILED
                   └→ Show error message

┌─────────────────────────────────────────┐
│  SlideCarousel Component                │
│  • Display one slide at a time          │
│  • Auto-advance every 8 seconds         │
│  • Manual navigation with arrows        │
│  • Thumbnail strip for quick jump       │
└─────────────────────────────────────────┘
```

---

## ✨ Component Tree

```
app/
├── page.tsx (Landing)
│   └── CreateDeckForm
│       └── Button, Input, Spinner
│
├── decks/
│   └── page.tsx (Gallery)
│       └── DeckCard (repeated)
│           └── Badge, Button
│
└── deck/[id]/
    └── page.tsx (Viewer)
        ├── DeckCard (header)
        ├── SlideCarousel
        │   ├── Image
        │   ├── Thumbnails
        │   └── Details Panel
        └── AlertDialog (delete confirmation)
```

---

## 🎮 User Interactions

### From Landing Page
1. **Type business idea** in input field
2. **Click "Create Pitch Deck"** button
3. **Automatically redirect** to deck viewer
4. **See real-time progress** as "GENERATING" status
5. **View slides in carousel** when complete

### From Gallery
1. **See all decks** in grid view
2. **Status badge** shows generation progress
3. **Click card** to view completed deck
4. **Auto-refresh** shows new decks

### In Deck Viewer
1. **View slides** one at a time
2. **Arrow buttons** or **thumbnails** to navigate
3. **Auto-advance** every 8 seconds
4. **Share link** with copy button
5. **Delete deck** with confirmation dialog

---

## 🔍 Real-time Behavior

### Gallery Page (/decks)
- Fetches all decks on load
- **Auto-refreshes every 5 seconds** to show status updates
- Shows "GENERATING" badge while processing
- Displays "COMPLETED" once ready

### Deck Viewer (/deck/[id])
- Fetches deck details on load
- **Polls every 2 seconds** for status updates
- Shows spinner during generation
- Displays carousel once slides ready
- **Stops polling** when COMPLETED or FAILED

---

## 🚀 Testing Checklist

- [ ] Create new deck from landing page
- [ ] See deck appear in gallery with PENDING status
- [ ] Watch status change to GENERATING in real-time
- [ ] See slides populate when COMPLETED
- [ ] Navigate slides with arrows and thumbnails
- [ ] Auto-advance slides every 8 seconds
- [ ] Copy and share deck link
- [ ] Delete deck from viewer
- [ ] See deleted deck removed from gallery

---

## 📚 Technologies Used

- **Next.js 16** - React framework
- **React 19** - UI library
- **Prisma 7** - Database ORM
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Remixicon** - Icons
- **Inngest** - Job queue
- **date-fns** - Date formatting

---

**Need Help?** Check [FRONTEND_IMPLEMENTATION.md](./FRONTEND_IMPLEMENTATION.md) for detailed component documentation.
