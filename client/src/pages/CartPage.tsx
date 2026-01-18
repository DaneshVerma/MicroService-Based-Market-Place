import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Button, Card, CardContent, Skeleton } from "@/components/ui";
import {
  useCart,
  useUpdateCartItem,
  useRemoveFromCart,
  useClearCart,
} from "@/hooks";
import { useCartStore } from "@/stores";

export function CartPage() {
  const navigate = useNavigate();
  const { isLoading, error } = useCart();
  const { items, totalPrice } = useCartStore();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Shopping Cart</h1>
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className='p-4 flex gap-4'>
                <Skeleton className='h-24 w-24 rounded' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-1/2' />
                  <Skeleton className='h-4 w-1/4' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Card className='p-8 text-center'>
          <p className='text-destructive'>
            Failed to load cart. Please try again.
          </p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-3xl font-bold mb-8'>Shopping Cart</h1>
        <Card className='p-12 text-center'>
          <ShoppingBag className='h-16 w-16 mx-auto text-muted-foreground' />
          <h2 className='text-xl font-semibold mt-4'>Your cart is empty</h2>
          <p className='text-muted-foreground mt-2'>
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to='/products'>
            <Button className='mt-6'>
              Start Shopping
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl font-bold'>Shopping Cart</h1>
        <Button
          variant='outline'
          size='sm'
          onClick={handleClearCart}
          disabled={isClearing}
        >
          {isClearing ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            "Clear Cart"
          )}
        </Button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Cart Items */}
        <div className='lg:col-span-2 space-y-4'>
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className='p-4'>
                <div className='flex gap-4'>
                  <Link to={`/products/${item.productId}`}>
                    <div className='h-24 w-24 bg-secondary rounded flex items-center justify-center overflow-hidden'>
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <ShoppingBag className='h-8 w-8 text-muted-foreground' />
                      )}
                    </div>
                  </Link>
                  <div className='flex-1'>
                    <Link to={`/products/${item.productId}`}>
                      <h3 className='font-semibold hover:text-primary'>
                        {item.name}
                      </h3>
                    </Link>
                    <p className='text-lg font-bold text-primary mt-1'>
                      ${item.price.toFixed(2)}
                    </p>
                    <div className='flex items-center gap-4 mt-3'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity - 1,
                            )
                          }
                          disabled={item.quantity <= 1 || isUpdating}
                        >
                          <Minus className='h-4 w-4' />
                        </Button>
                        <span className='w-8 text-center'>{item.quantity}</span>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity + 1,
                            )
                          }
                          disabled={isUpdating}
                        >
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-destructive hover:text-destructive'
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={isRemoving}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-semibold'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className='sticky top-24'>
            <CardContent className='p-6'>
              <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>
              <div className='space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span className='text-green-600'>Free</span>
                </div>
                <div className='border-t pt-3'>
                  <div className='flex justify-between font-semibold'>
                    <span>Total</span>
                    <span className='text-primary'>
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className='w-full mt-6'
                size='lg'
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
              <Link to='/products'>
                <Button variant='outline' className='w-full mt-2'>
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
