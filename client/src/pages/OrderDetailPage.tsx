import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard, Loader2 } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Badge } from '@/components/ui';
import { useOrder, useCancelOrder } from '@/hooks';
import type { OrderStatus, PaymentStatus } from '@/types';

const orderStatusColors: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = useOrder(id!);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  const order = data?.order;

  const handleCancelOrder = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(id!);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-1/4 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8 text-center">
          <p className="text-destructive">Order not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </Card>
      </div>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/orders')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order #{order._id.slice(-8)}</h1>
          <p className="text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={orderStatusColors[order.orderStatus]}>
            {order.orderStatus}
          </Badge>
          <Badge className={paymentStatusColors[order.paymentStatus]}>
            {order.paymentStatus}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 py-4 border-b last:border-0">
                    <div className="h-20 w-20 bg-secondary rounded flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded" />
                      ) : (
                        <Package className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.shippingAddress.street}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress.country}</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {canCancel && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancelOrder}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Order'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
