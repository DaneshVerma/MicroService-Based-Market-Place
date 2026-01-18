# 🛒 Microservice-Based Marketplace

A scalable e-commerce marketplace built with microservices architecture using Node.js, Express, MongoDB, Redis, and RabbitMQ, with a modern React frontend.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Express](https://img.shields.io/badge/Express-5.x-blue?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Services](#-services)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🎯 Overview

This is a full-featured marketplace platform where users can:

- 👤 Register, login, and manage their profiles
- 🛍️ Browse and search products
- 🛒 Add items to cart and checkout
- 💳 Make secure payments via Razorpay
- 📦 Track orders
- 🏪 Sellers can manage their products and view analytics
- 🤖 AI-powered shopping assistant

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway / Load Balancer               │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│     Auth      │       │    Product    │       │     Cart      │
│   Service     │       │    Service    │       │   Service     │
│   :3000       │       │    :3001      │       │   :3002       │
└───────┬───────┘       └───────┬───────┘       └───────┬───────┘
        │                       │                       │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│    Order      │       │   Payment     │       │  AI Buddy     │
│   Service     │       │   Service     │       │   Service     │
│   :3003       │       │   :3004       │       │   :3005       │
└───────┬───────┘       └───────┬───────┘       └───────┬───────┘
        │                       │                       │
        ▼                         ▼                         ▼
┌───────────────┐       ┌───────────────┐
│ Notification  │       │    Seller     │
│   Service     │       │  Dashboard    │
│   :3006       │       │   :3007       │
└───────────────┘       └───────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
    ┌───────────────────────────────────┐
    │         Message Broker            │
    │          (RabbitMQ)               │
    └───────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
┌────────┐    ┌──────────┐    ┌─────────┐
│MongoDB │    │  Redis   │    │ ImageKit│
└────────┘    └──────────┘    └─────────┘
```

## 🔧 Services

| Service              | Port | Description                                                       |
| -------------------- | ---- | ----------------------------------------------------------------- |
| **Client**           | 5173 | React frontend with Vite, TailwindCSS, shadcn/ui                  |
| **Auth**             | 3000 | User authentication, registration, JWT tokens, address management |
| **Product**          | 3001 | Product CRUD, search, categories, image uploads                   |
| **Cart**             | 3002 | Shopping cart management                                          |
| **Order**            | 3003 | Order processing, status tracking                                 |
| **Payment**          | 3004 | Razorpay payment integration                                      |
| **AI Buddy**         | 3005 | AI-powered shopping assistant (Google AI)                         |
| **Notification**     | 3006 | Email notifications via RabbitMQ                                  |
| **Seller Dashboard** | 3007 | Seller analytics and product management                           |

## 🛠️ Tech Stack

### Frontend

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** TailwindCSS 4, shadcn/ui
- **State Management:** Zustand, TanStack Query
- **Routing:** React Router 7

### Backend

- **Runtime:** Node.js 18+
- **Framework:** Express.js 5
- **Database:** MongoDB with Mongoose
- **Cache:** Redis
- **Message Broker:** RabbitMQ
- **Authentication:** JWT

### External Services

- **Image Storage:** ImageKit
- **Payments:** Razorpay
- **AI:** Google Generative AI
- **Email:** Nodemailer

### DevOps

- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Cloud:** AWS (ECS, ECR, ALB)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (recommended)
- MongoDB
- Redis
- RabbitMQ

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/DaneshVerma/MicroService-Based-Market-Place.git
cd MicroService-Based-Market-Place

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start all services (backend + infrastructure)
docker-compose up -d

# Start the frontend
cd client
npm install
npm run dev

# View backend logs
docker-compose logs -f
```

### Manual Setup

```bash
# Clone the repository
git clone https://github.com/DaneshVerma/MicroService-Based-Market-Place.git
cd MicroService-Based-Market-Place

# Setup frontend
cd client
cp .env.example .env
npm install
npm run dev

# Setup each backend service (in separate terminals)
cd auth
cp example.env .env
npm install
npm run dev

# Repeat for other services...
```

## 📡 API Endpoints

### Auth Service (`:3000`)

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
POST   /api/auth/logout       - Logout user
GET    /api/auth/me           - Get current user
POST   /api/auth/addresses    - Add address
GET    /api/auth/addresses    - Get addresses
```

### Product Service (`:3001`)

```
GET    /api/products          - Get all products
GET    /api/products/:id      - Get product by ID
POST   /api/products          - Create product (seller)
PATCH  /api/products/:id      - Update product (seller)
DELETE /api/products/:id      - Delete product (seller)
GET    /api/products/seller   - Get seller's products
```

### Cart Service (`:3002`)

```
GET    /api/cart              - Get cart
POST   /api/cart/items        - Add item to cart
PATCH  /api/cart/items/:id    - Update cart item
DELETE /api/cart/items/:id    - Remove from cart
```

### Order Service (`:3003`)

```
GET    /api/orders            - Get user orders
GET    /api/orders/:id        - Get order by ID
POST   /api/orders            - Create order
PATCH  /api/orders/:id/status - Update order status
```

### Payment Service (`:3004`)

```
POST   /api/payment/create    - Create payment order
POST   /api/payment/verify    - Verify payment
```

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb://localhost:27017/marketplace

# Redis
REDIS_URL=redis://localhost:6379

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# JWT
JWT_SECRET=your-super-secret-key

# ImageKit (Product Service)
IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id

# Razorpay (Payment Service)
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# Google AI (AI Buddy Service)
GOOGLE_AI_API_KEY=your-api-key

# Email (Notification Service)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Each service also has its own `example.env` file with service-specific variables.

## 📜 Scripts

All services support the following npm scripts:

### Backend Services

```bash
npm run dev       # Start with hot reload (nodemon)
npm start         # Start in production mode
npm test          # Run tests (where available)
npm run lint      # Check code quality with ESLint
npm run lint:fix  # Auto-fix lint issues
```

### Frontend (client)

```bash
npm run dev       # Start Vite dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Check code quality with ESLint
npm run lint:fix  # Auto-fix lint issues
```

## ☁️ Deployment

### Local Development (Docker Compose)

The easiest way to run everything locally:

```bash
docker-compose up -d
```

### Production Deployment Options

| Platform                      | Best For           | Notes                                                        |
| ----------------------------- | ------------------ | ------------------------------------------------------------ |
| **AWS ECS**                   | Production scale   | Use ECS Fargate with ALB, DocumentDB, ElastiCache, Amazon MQ |
| **Railway**                   | Quick deployment   | Easy GitHub integration, free tier available                 |
| **Render**                    | Simple hosting     | 750 free hours/month                                         |
| **DigitalOcean App Platform** | Managed containers | Simple pricing                                               |

### AWS Architecture (Recommended for Production)

- **ECS Fargate** - Serverless container orchestration
- **ECR** - Container registry for Docker images
- **ALB** - Application Load Balancer for routing
- **DocumentDB** - Managed MongoDB compatible database
- **ElastiCache** - Managed Redis for caching
- **Amazon MQ** - Managed RabbitMQ for messaging

Each service has a `dockerfile` ready for containerized deployment.

## 🧪 Testing

```bash
# Run tests for a specific service
cd auth
npm test
```

**Services with tests:** auth, product, cart, order

## 📁 Project Structure

```
MicroService-Based-Market-Place/
├── client/               # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── stores/       # Zustand state stores
│   │   ├── services/     # API service functions
│   │   └── types/        # TypeScript types
│   └── ...
├── auth/                 # Authentication service
├── product/              # Product catalog service
├── cart/                 # Shopping cart service
├── order/                # Order management service
├── payment/              # Payment processing service
├── ai-buddy/             # AI assistant service
├── notification/         # Email notification service
├── seller-dashboard/     # Seller analytics service
├── .github/workflows/    # CI/CD pipelines
├── docker-compose.yml    # Docker orchestration
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Danesh Verma**

- GitHub: [@DaneshVerma](https://github.com/DaneshVerma)

---

⭐ Star this repository if you find it helpful!
