import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Loader2 } from 'lucide-react';
import { Button, Input, Label, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { useRegister } from '@/hooks';

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: register, isPending, error } = useRegister();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'buyer' | 'seller',
  });
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    register(registerData, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Store className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join our marketplace today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={formData.role === 'buyer'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'buyer' | 'seller' })}
                    className="mr-2"
                  />
                  <span className="text-sm">Buyer</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === 'seller'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'buyer' | 'seller' })}
                    className="mr-2"
                  />
                  <span className="text-sm">Seller</span>
                </label>
              </div>
            </div>
            {(validationError || error) && (
              <p className="text-sm text-destructive">
                {validationError || (error as Error).message || 'Registration failed'}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
