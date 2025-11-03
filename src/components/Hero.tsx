import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-block">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Certified Manufacturing Excellence
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Your Trusted
              <span className="text-primary"> Textile OEM</span> Partner
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              Delivering world-class textile manufacturing solutions with certified quality, 
              transparent supply chains, and complete compliance management for global brands.
            </p>

            <div className="space-y-3">
              {[
                'ISO 9001 & GOTS Certified',
                'End-to-End Supply Chain Visibility',
                'Compliance & ESG Reporting',
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="group">
                <Link to="/contact">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/products">
                  View Products
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="text-6xl font-bold text-primary">24/7</div>
                  <div className="text-xl font-semibold">Operations Portal</div>
                  <div className="text-muted-foreground">Real-time monitoring & analytics</div>
                </div>
              </div>
            </div>
            
            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -left-6 bg-card border border-border rounded-lg p-4 shadow-lg"
            >
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Orders Completed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute -top-6 -right-6 bg-card border border-border rounded-lg p-4 shadow-lg"
            >
              <div className="text-2xl font-bold text-accent">99.8%</div>
              <div className="text-sm text-muted-foreground">Quality Rate</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
