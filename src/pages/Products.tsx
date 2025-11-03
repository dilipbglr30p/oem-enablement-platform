import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shirt, Layers, Package } from 'lucide-react';

const products = [
  {
    icon: Shirt,
    name: 'Apparel Manufacturing',
    description: 'Complete garment production including t-shirts, shirts, dresses, and activewear.',
    features: ['Custom designs', 'Multiple fabric options', 'Size range flexibility', 'Rapid prototyping'],
  },
  {
    icon: Layers,
    name: 'Fabric Production',
    description: 'High-quality fabric manufacturing with various weaves, knits, and blends.',
    features: ['Organic cotton', 'Synthetic blends', 'Specialty fabrics', 'Custom dyeing'],
  },
  {
    icon: Package,
    name: 'Private Label Solutions',
    description: 'End-to-end private label services from design to packaging.',
    features: ['Brand development', 'Custom packaging', 'Quality control', 'Direct shipping'],
  },
];

const Products = () => {
  return (
    <>
      <Helmet>
        <title>Products & Services | Textile OEM Platform</title>
        <meta name="description" content="Explore our comprehensive textile manufacturing services including apparel, fabrics, and private label solutions." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products & Services</h1>
                <p className="text-lg text-muted-foreground">
                  Comprehensive textile manufacturing solutions tailored to your brand's needs.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Products Grid */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-8 hover:shadow-lg transition-shadow"
                  >
                    <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                      <product.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">{product.name}</h3>
                    <p className="text-muted-foreground mb-6">{product.description}</p>
                    <ul className="space-y-2">
                      {product.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Capabilities */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl font-bold mb-4">Manufacturing Capabilities</h2>
                  <p className="text-lg text-muted-foreground">
                    State-of-the-art facilities equipped to handle projects of any scale.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: 'Production Capacity', value: '500K units/month' },
                    { label: 'Minimum Order', value: '100 units' },
                    { label: 'Lead Time', value: '4-8 weeks' },
                    { label: 'Quality Check', value: '100% inspection' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border rounded-lg p-6"
                    >
                      <div className="text-sm text-muted-foreground mb-2">{item.label}</div>
                      <div className="text-2xl font-bold text-primary">{item.value}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Products;
