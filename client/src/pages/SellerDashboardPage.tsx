import { useState } from "react";
import { Plus, Edit, Trash2, Package, Loader2 } from "lucide-react";
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
import {
  useSellerProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks";
import type { Product, CreateProductRequest } from "@/types";

export function SellerDashboardPage() {
  const { data, isLoading, error } = useSellerProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    images: [],
  });

  const products = data?.products || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(
        { id: editingProduct._id, data: formData },
        {
          onSuccess: () => {
            setShowForm(false);
            setEditingProduct(null);
            resetForm();
          },
        },
      );
    } else {
      createProduct(formData, {
        onSuccess: () => {
          setShowForm(false);
          resetForm();
        },
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images || [],
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setDeletingId(id);
      deleteProduct(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      images: [],
    });
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingProduct(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Skeleton className='h-8 w-1/4 mb-8' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className='h-64' />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Card className='p-8 text-center'>
          <p className='text-destructive'>
            Failed to load products. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Seller Dashboard</h1>
          <p className='text-muted-foreground mt-1'>
            {products.length} product(s)
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Add Product
          </Button>
        )}
      </div>

      {/* Product Form */}
      {showForm && (
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='name'>Product Name</Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='category'>Category</Label>
                  <select
                    id='category'
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
                    required
                  >
                    <option value=''>Select category</option>
                    <option value='Electronics'>Electronics</option>
                    <option value='Clothing'>Clothing</option>
                    <option value='Books'>Books</option>
                    <option value='Home'>Home</option>
                    <option value='Sports'>Sports</option>
                    <option value='Toys'>Toys</option>
                  </select>
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <textarea
                  id='description'
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]'
                  required
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='price'>Price ($)</Label>
                  <Input
                    id='price'
                    type='number'
                    min='0'
                    step='0.01'
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='stock'>Stock</Label>
                  <Input
                    id='stock'
                    type='number'
                    min='0'
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='images'>Image URL (optional)</Label>
                <Input
                  id='images'
                  value={formData.images?.[0] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      images: e.target.value ? [e.target.value] : [],
                    })
                  }
                  placeholder='https://example.com/image.jpg'
                />
              </div>
              <div className='flex gap-2'>
                <Button type='submit' disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {editingProduct ? "Updating..." : "Creating..."}
                    </>
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    "Create Product"
                  )}
                </Button>
                <Button type='button' variant='outline' onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <Card className='p-12 text-center'>
          <Package className='h-16 w-16 mx-auto text-muted-foreground' />
          <h2 className='text-xl font-semibold mt-4'>No products yet</h2>
          <p className='text-muted-foreground mt-2'>
            Start by adding your first product.
          </p>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {products.map((product) => (
            <Card key={product._id} className='overflow-hidden'>
              <div className='h-40 bg-secondary flex items-center justify-center'>
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <Package className='h-12 w-12 text-muted-foreground' />
                )}
              </div>
              <CardContent className='p-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='font-semibold line-clamp-1'>
                      {product.name}
                    </h3>
                    <Badge className='mt-1'>{product.category}</Badge>
                  </div>
                  <p className='text-lg font-bold text-primary'>
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <p className='text-sm text-muted-foreground mt-2 line-clamp-2'>
                  {product.description}
                </p>
                <div className='flex items-center justify-between mt-4'>
                  <Badge
                    variant={product.stock > 0 ? "secondary" : "destructive"}
                  >
                    {product.stock} in stock
                  </Badge>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      className='text-destructive hover:text-destructive'
                      onClick={() => handleDelete(product._id)}
                      disabled={isDeleting && deletingId === product._id}
                    >
                      {isDeleting && deletingId === product._id ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash2 className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
