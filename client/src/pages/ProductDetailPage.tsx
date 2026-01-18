import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { Button, Card, CardContent, Skeleton, Badge } from "@/components/ui";
import { useProduct, useAddToCart } from "@/hooks";
import { useAuthStore } from "@/stores";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useProduct(id!);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = data?.product;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!product) return;

    addToCart({ productId: product._id, quantity });
  };

  if (isLoading) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <Skeleton className='h-96 w-full rounded-lg' />
          <div className='space-y-4'>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='h-20 w-full' />
            <Skeleton className='h-10 w-32' />
            <Skeleton className='h-12 w-full' />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Card className='p-8 text-center'>
          <p className='text-destructive'>Product not found.</p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => navigate("/products")}
          >
            Back to Products
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      {/* Back button */}
      <Button
        variant='ghost'
        className='mb-6'
        onClick={() => navigate("/products")}
      >
        <ArrowLeft className='h-4 w-4 mr-2' />
        Back to Products
      </Button>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Product Images */}
        <div className='space-y-4'>
          <div className='h-96 bg-secondary rounded-lg flex items-center justify-center overflow-hidden'>
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='text-muted-foreground'>No image available</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className='flex gap-2 overflow-x-auto'>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 w-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className='h-full w-full object-cover'
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='space-y-6'>
          <div>
            <Badge className='mb-2'>{product.category}</Badge>
            <h1 className='text-3xl font-bold text-foreground'>
              {product.name}
            </h1>
            {product.ratings && (
              <div className='flex items-center gap-2 mt-2'>
                <div className='flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.ratings!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className='text-sm text-muted-foreground'>
                  {product.ratings.toFixed(1)} ({product.numReviews} reviews)
                </span>
              </div>
            )}
          </div>

          <p className='text-muted-foreground'>{product.description}</p>

          <div className='flex items-center justify-between'>
            <span className='text-3xl font-bold text-primary'>
              ${product.price.toFixed(2)}
            </span>
            <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </Badge>
          </div>

          <Card>
            <CardContent className='p-4'>
              {/* Quantity Selector */}
              <div className='flex items-center justify-between mb-4'>
                <span className='text-sm font-medium'>Quantity</span>
                <div className='flex items-center gap-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className='h-4 w-4' />
                  </Button>
                  <span className='w-12 text-center font-medium'>
                    {quantity}
                  </span>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    disabled={quantity >= product.stock}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className='flex items-center justify-between mb-4 pt-4 border-t'>
                <span className='text-sm font-medium'>Total</span>
                <span className='text-xl font-bold text-primary'>
                  ${(product.price * quantity).toFixed(2)}
                </span>
              </div>

              {/* Add to Cart Button */}
              <Button
                className='w-full'
                size='lg'
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className='mr-2 h-5 w-5' />
                    Add to Cart
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
