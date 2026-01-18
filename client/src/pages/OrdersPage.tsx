import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { Card, CardContent, Skeleton, Badge } from "@/components/ui";
import { useOrders } from "@/hooks";
import type { OrderStatus, PaymentStatus } from "@/types";

const orderStatusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentStatusColors: Record<PaymentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export function OrdersPage() {
  const { data, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-3xl font-bold mb-8'>My Orders</h1>
        <div className='space-y-4'>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <Skeleton className='h-6 w-1/4 mb-4' />
                <Skeleton className='h-4 w-1/2 mb-2' />
                <Skeleton className='h-4 w-1/3' />
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
            Failed to load orders. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  const orders = data?.orders || [];

  if (orders.length === 0) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <h1 className='text-3xl font-bold mb-8'>My Orders</h1>
        <Card className='p-12 text-center'>
          <Package className='h-16 w-16 mx-auto text-muted-foreground' />
          <h2 className='text-xl font-semibold mt-4'>No orders yet</h2>
          <p className='text-muted-foreground mt-2'>
            Start shopping to see your orders here.
          </p>
          <Link to='/products'>
            <button className='mt-6 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'>
              Browse Products
            </button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold mb-8'>My Orders</h1>
      <div className='space-y-4'>
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`}>
            <Card className='hover:shadow-md transition-shadow'>
              <CardContent className='p-6'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <p className='font-semibold'>
                        Order #{order._id.slice(-8)}
                      </p>
                      <Badge className={orderStatusColors[order.orderStatus]}>
                        {order.orderStatus}
                      </Badge>
                      <Badge
                        className={paymentStatusColors[order.paymentStatus]}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {order.items.length} item(s)
                    </p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <p className='text-lg font-bold text-primary'>
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <ChevronRight className='h-5 w-5 text-muted-foreground' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
