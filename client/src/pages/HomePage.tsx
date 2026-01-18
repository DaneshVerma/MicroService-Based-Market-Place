import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui';

export function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-linear-to-b from-background to-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
              <span className="block">Welcome to</span>
              <span className="block text-primary">Marketplace</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Discover amazing products from trusted sellers. Shop with confidence using our secure platform.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 gap-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto mt-3 sm:mt-0">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-foreground">
              Why Choose Marketplace?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We provide the best shopping experience with these amazing features
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative p-6 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">Wide Selection</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse thousands of products from various categories
              </p>
            </div>

            <div className="relative p-6 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">Fast Delivery</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get your orders delivered quickly and reliably
              </p>
            </div>

            <div className="relative p-6 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">Secure Payments</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your transactions are protected with advanced security
              </p>
            </div>

            <div className="relative p-6 bg-card rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">24/7 Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our support team is always ready to help you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-primary-foreground">
            Ready to start shopping?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join thousands of happy customers today
          </p>
          <div className="mt-8">
            <Link to="/products">
              <Button size="lg" variant="secondary">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
