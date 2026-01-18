export const API_CONFIG = {
  AUTH_SERVICE: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3000',
  PRODUCT_SERVICE: import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3001',
  CART_SERVICE: import.meta.env.VITE_CART_SERVICE_URL || 'http://localhost:3002',
  ORDER_SERVICE: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:3003',
  PAYMENT_SERVICE: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:3004',
  AI_BUDDY_SERVICE: import.meta.env.VITE_AI_BUDDY_SERVICE_URL || 'http://localhost:3005',
  NOTIFICATION_SERVICE: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3006',
  SELLER_DASHBOARD_SERVICE: import.meta.env.VITE_SELLER_DASHBOARD_SERVICE_URL || 'http://localhost:3007',
} as const;

export const QUERY_KEYS = {
  // Auth
  USER: ['user'],
  ADDRESSES: ['addresses'],
  
  // Products
  PRODUCTS: ['products'],
  PRODUCT: (id: string) => ['product', id],
  SELLER_PRODUCTS: ['seller-products'],
  
  // Cart
  CART: ['cart'],
  
  // Orders
  ORDERS: ['orders'],
  ORDER: (id: string) => ['order', id],
  
  // Seller Dashboard
  SELLER_STATS: ['seller-stats'],
  SELLER_ORDERS: ['seller-orders'],
} as const;
