import { Store, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Marketplace</span>
            </div>
            <p className="mt-4 text-muted-foreground text-sm">
              A modern microservices-based marketplace built with React, Node.js, and MongoDB.
              Shop from thousands of products from verified sellers.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-foreground text-sm">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-foreground text-sm">
                  Orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              Account
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-foreground text-sm">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-foreground text-sm">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Marketplace. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
