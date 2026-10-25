# NoteMaking Frontend (NoteMaking_F)

Modern, enterprise-grade Notion clone frontend built with Next.js 14 (App Router), React, TypeScript, and Tailwind CSS.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), Lucide Icons
- **Language**: TypeScript
- **State & Context**: React Context (Auth, Theme, Sidebar)
- **API Client**: Fetch-based client with JWT token management

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- NoteMaking Backend running (or reachable via URL)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` or `.env` file based on `.env.example`:
```bash
cp .env.example .env.local
```

Set your backend API endpoint:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Running the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Building for Production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                  # Next.js App Router pages & layouts
│   │   ├── (auth)/login      # Login page
│   │   ├── (auth)/register   # Registration page
│   │   ├── app/              # Main dashboard & notes workspace
│   │   │   ├── notes/        # Note detail view & editor
│   │   │   └── trash/        # Trash & restoration page
│   │   ├── share/[slug]/     # Public shared note view
│   │   ├── globals.css       # Tailwind CSS & global styling
│   │   ├── layout.tsx        # Root HTML layout
│   │   └── page.tsx          # Landing / Hero page
│   ├── components/           # Reusable UI components
│   │   ├── CommandPalette.tsx
│   │   ├── CoverImageModal.tsx
│   │   ├── IconPickerModal.tsx
│   │   ├── NotionEditor.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   └── lib/                  # Shared utilities & React Contexts
│       ├── api.ts            # API service calls
│       ├── auth-context.tsx  # Authentication provider & hook
│       ├── sidebar-context.tsx
│       └── theme-context.tsx
├── .env.example
├── .gitignore
├── next.config.mjs
├── package.json
├── tailwind.config.js
└── tsconfig.json
```
