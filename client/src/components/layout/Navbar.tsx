import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Store, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { useAuthStore, useCartStore } from '@/stores';
import { useLogout } from '@/hooks';

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const cartStore = useCartStore();
  const { mutate: logout } = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cartStore.itemCount();

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Store className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Marketplace</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/products"
                className="text-muted-foreground hover:text-foreground inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Products
              </Link>
              {user?.role === 'seller' && (
                <Link
                  to="/seller/dashboard"
                  className="text-muted-foreground hover:text-foreground inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Seller Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link to="/orders">
                  <Button variant="ghost" size="icon">
                    <Package className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/products"
              className="block pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            {user?.role === 'seller' && (
              <Link
                to="/seller/dashboard"
                className="block pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                Seller Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link
                  to="/cart"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart ({cartItemCount})
                </Link>
                <Link
                  to="/orders"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
