import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Mail, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { signInWithPassword, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    
    const result = await signInWithPassword(email, password);
    if (!result.success) {
      setErrorMsg('❌ Login failed: ' + (result.error?.message || 'Invalid credentials'));
    }
  };

  return (
    <>
      <Helmet>
        <title>Login | Textile OEM Platform</title>
        <meta name="description" content="Access your TextileOEM operations portal for order management, compliance tracking, and analytics." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-card border border-border rounded-lg shadow-lg p-8">
            {/* Logo */}
            <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
              <Package className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">TextileOEM</span>
            </Link>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to access your operations portal
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm">{errorMsg}</p>
              </div>
            )}

            {/* Back to home */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
