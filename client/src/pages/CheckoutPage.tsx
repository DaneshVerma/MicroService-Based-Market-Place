import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Loader2, CheckCircle } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '@/components/ui';
import { useAddresses, useAddAddress, useCreateOrder, useClearCart } from '@/hooks';
import { useCartStore } from '@/stores';
import type { Address } from '@/types';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice } = useCartStore();
  const { data: addressData, isLoading: addressesLoading } = useAddresses();
  const { mutate: addAddress, isPending: isAddingAddress } = useAddAddress();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutate: clearCart } = useClearCart();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
  });

  const addresses = addressData?.addresses || [];

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddress as Omit<Address, '_id'>, {
      onSuccess: () => {
        setShowAddressForm(false);
        setNewAddress({ street: '', city: '', state: '', country: '', zipCode: '' });
      },
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address');
      return;
    }

    createOrder(
      { shippingAddressId: selectedAddressId },
      {
        onSuccess: (response) => {
          clearCart();
          navigate(`/orders/${response.order._id}`);
        },
      }
    );
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {addressesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : addresses.length === 0 && !showAddressForm ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No addresses found</p>
                  <Button onClick={() => setShowAddressForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddressId === address._id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedAddressId(address._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{address.street}</p>
                          <p className="text-sm text-muted-foreground">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p className="text-sm text-muted-foreground">{address.country}</p>
                        </div>
                        {selectedAddressId === address._id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}

                  {!showAddressForm && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowAddressForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  )}

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="space-y-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={isAddingAddress}>
                          {isAddingAddress ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            'Add Address'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowAddressForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="h-16 w-16 bg-secondary rounded flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No img</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || isCreatingOrder}
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
