import { Helmet } from 'react-helmet-async';
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Package } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found | Textile OEM Platform</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to our homepage to explore our textile manufacturing services." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-border shadow-lg">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Package className="h-8 w-8 text-primary" />
              </motion.div>
              <CardTitle className="text-4xl font-bold text-primary mb-2">404</CardTitle>
              <CardDescription className="text-lg">
                Oops! The page you're looking for doesn't exist.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-muted-foreground"
              >
                <p className="mb-4">
                  The page <code className="bg-muted px-2 py-1 rounded text-sm">{location.pathname}</code> could not be found.
                </p>
                <p className="text-sm">
                  This might be because the page has been moved, deleted, or you entered the wrong URL.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button asChild className="flex-1">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="javascript:history.back()">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <p className="text-sm text-muted-foreground mb-2">Need help?</p>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound;
