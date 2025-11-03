import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 group">
          <Package className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold">TextileOEM</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex md:items-center md:space-x-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={signOut} variant="outline">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="container mx-auto space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Button asChild className="w-full" variant="ghost">
                      <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-full" variant="outline">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild className="w-full" variant="ghost">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
