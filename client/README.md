# Marketplace Client

A modern React frontend for the Microservice-Based Marketplace.

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Navbar, Footer)
│   │   ├── ui/              # Reusable UI components (shadcn)
│   │   └── ProtectedRoute.tsx
│   ├── config/
│   │   └── api.config.ts    # API configuration & query keys
│   ├── hooks/               # Custom React Query hooks
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── pages/               # Page components
│   ├── services/            # API service functions
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript types
│   ├── App.tsx
│   └── router.tsx           # React Router configuration
├── .env.example             # Environment variables template
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
cd client
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

### 3. Start development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

### For Buyers

- Browse and search products
- Filter by category, price
- Add products to cart
- Checkout with address management
- View order history

### For Sellers

- Seller dashboard
- Add/Edit/Delete products
- View product inventory

## API Integration

The client connects to 8 microservices on ports 3000-3007.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
