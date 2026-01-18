import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Filter, Loader2, ShoppingCart, Star } from "lucide-react";
import {
  Button,
  Input,
  Card,
  CardContent,
  Skeleton,
  Badge,
} from "@/components/ui";
import { useProducts, useAddToCart } from "@/hooks";
import { useAuthStore } from "@/stores";
import type { ProductFilters, Product } from "@/types";

export function ProductsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useProducts(filters);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { isAuthenticated } = useAuthStore();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setAddingProductId(product._id);
    addToCart(
      { productId: product._id, quantity: 1 },
      {
        onSettled: () => setAddingProductId(null),
      },
    );
  };

  const categories = [
    "Electronics",
    "Clothing",
    "Books",
    "Home",
    "Sports",
    "Toys",
  ];

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>Products</h1>
          <p className='text-muted-foreground mt-1'>
            {data?.totalProducts || 0} products available
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className='flex gap-2 w-full md:w-auto'>
          <Input
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full md:w-64'
          />
          <Button type='submit' variant='outline'>
            <Search className='h-4 w-4' />
          </Button>
        </form>
      </div>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Filters Sidebar */}
        <aside className='w-full lg:w-64 space-y-6'>
          <Card>
            <CardContent className='p-4'>
              <h3 className='font-semibold flex items-center gap-2 mb-4'>
                <Filter className='h-4 w-4' />
                Filters
              </h3>

              {/* Categories */}
              <div className='space-y-3'>
                <h4 className='text-sm font-medium'>Categories</h4>
                <div className='space-y-2'>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, category: undefined, page: 1 })
                    }
                    className={`text-sm w-full text-left px-2 py-1 rounded ${
                      !filters.category
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        setFilters({ ...filters, category, page: 1 })
                      }
                      className={`text-sm w-full text-left px-2 py-1 rounded ${
                        filters.category === category
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className='space-y-3 mt-6'>
                <h4 className='text-sm font-medium'>Price Range</h4>
                <div className='flex gap-2'>
                  <Input
                    type='number'
                    placeholder='Min'
                    value={filters.minPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minPrice: Number(e.target.value) || undefined,
                        page: 1,
                      })
                    }
                    className='w-full'
                  />
                  <Input
                    type='number'
                    placeholder='Max'
                    value={filters.maxPrice || ""}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: Number(e.target.value) || undefined,
                        page: 1,
                      })
                    }
                    className='w-full'
                  />
                </div>
              </div>

              {/* Sort */}
              <div className='space-y-3 mt-6'>
                <h4 className='text-sm font-medium'>Sort By</h4>
                <select
                  value={filters.sort || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      sort: e.target.value as ProductFilters["sort"],
                      page: 1,
                    })
                  }
                  className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                >
                  <option value=''>Default</option>
                  <option value='price'>Price: Low to High</option>
                  <option value='-price'>Price: High to Low</option>
                  <option value='-createdAt'>Newest First</option>
                  <option value='ratings'>Top Rated</option>
                </select>
              </div>

              {/* Clear Filters */}
              <Button
                variant='outline'
                className='w-full mt-6'
                onClick={() => {
                  setFilters({ page: 1, limit: 12 });
                  setSearchTerm("");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className='flex-1'>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className='h-48 w-full rounded-t-lg' />
                  <CardContent className='p-4 space-y-2'>
                    <Skeleton className='h-4 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                    <Skeleton className='h-8 w-full mt-4' />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className='p-8 text-center'>
              <p className='text-destructive'>
                Failed to load products. Please try again.
              </p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </Card>
          ) : data?.products.length === 0 ? (
            <Card className='p-8 text-center'>
              <p className='text-muted-foreground'>No products found.</p>
            </Card>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {data?.products.map((product) => (
                  <Card key={product._id} className='overflow-hidden group'>
                    <Link to={`/products/${product._id}`}>
                      <div className='h-48 bg-secondary flex items-center justify-center overflow-hidden'>
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className='h-full w-full object-cover group-hover:scale-105 transition-transform'
                          />
                        ) : (
                          <div className='text-muted-foreground text-sm'>
                            No image
                          </div>
                        )}
                      </div>
                    </Link>
                    <CardContent className='p-4'>
                      <Link to={`/products/${product._id}`}>
                        <h3 className='font-semibold text-foreground hover:text-primary line-clamp-1'>
                          {product.name}
                        </h3>
                      </Link>
                      <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>
                        {product.description}
                      </p>
                      <div className='flex items-center justify-between mt-3'>
                        <span className='text-lg font-bold text-primary'>
                          ${product.price.toFixed(2)}
                        </span>
                        {product.ratings && (
                          <div className='flex items-center gap-1 text-sm'>
                            <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                            <span>{product.ratings.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <div className='flex items-center justify-between mt-3'>
                        <Badge
                          variant={
                            product.stock > 0 ? "secondary" : "destructive"
                          }
                        >
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </Badge>
                        <Button
                          size='sm'
                          onClick={() => handleAddToCart(product)}
                          disabled={
                            product.stock === 0 ||
                            (isAddingToCart && addingProductId === product._id)
                          }
                        >
                          {isAddingToCart && addingProductId === product._id ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <ShoppingCart className='h-4 w-4' />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {data && data.totalPages > 1 && (
                <div className='flex justify-center gap-2 mt-8'>
                  <Button
                    variant='outline'
                    disabled={filters.page === 1}
                    onClick={() =>
                      setFilters({ ...filters, page: (filters.page || 1) - 1 })
                    }
                  >
                    Previous
                  </Button>
                  <span className='flex items-center px-4 text-sm text-muted-foreground'>
                    Page {data.currentPage} of {data.totalPages}
                  </span>
                  <Button
                    variant='outline'
                    disabled={filters.page === data.totalPages}
                    onClick={() =>
                      setFilters({ ...filters, page: (filters.page || 1) + 1 })
                    }
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
