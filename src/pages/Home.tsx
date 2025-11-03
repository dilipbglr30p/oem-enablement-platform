import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Globe, Award } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Certified Quality',
    description: 'ISO 9001, GOTS, and OEKO-TEX certified manufacturing processes ensuring the highest standards.',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Tracking',
    description: 'Monitor your orders from production to delivery with complete supply chain visibility.',
  },
  {
    icon: Globe,
    title: 'Global Compliance',
    description: 'Full ESG reporting and compliance documentation for international regulations.',
  },
  {
    icon: Award,
    title: 'Excellence Guaranteed',
    description: '99.8% quality rate with dedicated QC teams and comprehensive testing protocols.',
  },
];

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home | Textile OEM Platform</title>
        <meta name="description" content="Leading textile OEM manufacturer with certified quality, real-time tracking, and global compliance solutions." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          <Hero />

          {/* Features Section */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Why Choose TextileOEM?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  We combine cutting-edge technology with decades of manufacturing expertise
                  to deliver unmatched value to our partners.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: '500+', label: 'Active Clients' },
                  { value: '2M+', label: 'Units Produced' },
                  { value: '15+', label: 'Countries Served' },
                  { value: '99.8%', label: 'Quality Rate' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;
