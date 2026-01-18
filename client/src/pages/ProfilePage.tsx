import { User, MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Skeleton,
  Badge,
} from "@/components/ui";
import { useMe, useAddresses, useAddAddress, useDeleteAddress } from "@/hooks";
import { useAuthStore } from "@/stores";
import type { Address } from "@/types";

export function ProfilePage() {
  const { user } = useAuthStore();
  const { data: meData, isLoading: meLoading } = useMe();
  const { data: addressData, isLoading: addressesLoading } = useAddresses();
  const { mutate: addAddress, isPending: isAddingAddress } = useAddAddress();
  const { mutate: deleteAddress, isPending: isDeletingAddress } =
    useDeleteAddress();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const addresses = addressData?.addresses || [];

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddress as Omit<Address, "_id">, {
      onSuccess: () => {
        setShowAddressForm(false);
        setNewAddress({
          street: "",
          city: "",
          state: "",
          country: "",
          zipCode: "",
        });
      },
    });
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      setDeletingId(id);
      deleteAddress(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  if (meLoading) {
    return (
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Skeleton className='h-8 w-1/4 mb-8' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <Skeleton className='h-48' />
          <Skeleton className='h-48' />
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <h1 className='text-3xl font-bold mb-8'>My Profile</h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <Label className='text-muted-foreground'>Name</Label>
              <p className='font-medium'>{user?.name}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Email</Label>
              <p className='font-medium'>{user?.email}</p>
            </div>
            <div>
              <Label className='text-muted-foreground'>Role</Label>
              <Badge className='mt-1'>{user?.role}</Badge>
            </div>
            <div>
              <Label className='text-muted-foreground'>Member Since</Label>
              <p className='font-medium'>
                {user?.createdAt &&
                  new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2'>
                <MapPin className='h-5 w-5' />
                Addresses
              </CardTitle>
              {!showAddressForm && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowAddressForm(true)}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {addressesLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-16' />
                <Skeleton className='h-16' />
              </div>
            ) : (
              <div className='space-y-4'>
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className='p-4 border rounded-lg flex justify-between items-start'
                  >
                    <div>
                      <p className='font-medium'>{address.street}</p>
                      <p className='text-sm text-muted-foreground'>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {address.country}
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:text-destructive'
                      onClick={() => handleDeleteAddress(address._id)}
                      disabled={isDeletingAddress && deletingId === address._id}
                    >
                      {isDeletingAddress && deletingId === address._id ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                ))}

                {addresses.length === 0 && !showAddressForm && (
                  <p className='text-center text-muted-foreground py-4'>
                    No addresses added yet.
                  </p>
                )}

                {showAddressForm && (
                  <form
                    onSubmit={handleAddAddress}
                    className='space-y-4 p-4 border rounded-lg'
                  >
                    <div className='space-y-2'>
                      <Label htmlFor='street'>Street Address</Label>
                      <Input
                        id='street'
                        value={newAddress.street}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            street: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='city'>City</Label>
                        <Input
                          id='city'
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              city: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='state'>State</Label>
                        <Input
                          id='state'
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              state: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <div className='space-y-2'>
                        <Label htmlFor='zipCode'>ZIP Code</Label>
                        <Input
                          id='zipCode'
                          value={newAddress.zipCode}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              zipCode: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='country'>Country</Label>
                        <Input
                          id='country'
                          value={newAddress.country}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              country: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        type='submit'
                        size='sm'
                        disabled={isAddingAddress}
                      >
                        {isAddingAddress ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Adding...
                          </>
                        ) : (
                          "Add"
                        )}
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
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
      </div>
    </div>
  );
}
