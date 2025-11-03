import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Users, Target, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Textile OEM Platform</title>
        <meta name="description" content="Learn about our mission to deliver excellence in textile manufacturing with certified quality and sustainable practices." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 to-background">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto text-center"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About TextileOEM</h1>
                <p className="text-lg text-muted-foreground">
                  With over 25 years of experience, we've built our reputation on quality, 
                  transparency, and innovation in textile manufacturing.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Mission, Vision, Values */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Target,
                    title: 'Our Mission',
                    description: 'To empower global brands with transparent, compliant, and sustainable textile manufacturing solutions that exceed expectations.',
                  },
                  {
                    icon: Lightbulb,
                    title: 'Our Vision',
                    description: 'To be the most trusted textile OEM partner worldwide, setting new standards for quality and ethical manufacturing.',
                  },
                  {
                    icon: Users,
                    title: 'Our Values',
                    description: 'Quality, transparency, sustainability, and partnership guide everything we do in our manufacturing process.',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-8"
                  >
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-bold">Our Story</h2>
                  <p className="text-lg text-muted-foreground">
                    Founded in 1998, TextileOEM started as a small family-owned textile manufacturer 
                    in Mumbai. Today, we've grown into a leading OEM partner serving over 500 brands 
                    across 15 countries.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    Our success is built on three pillars: unwavering commitment to quality, 
                    investment in cutting-edge technology, and deep respect for our workers and 
                    the environment. Every garment we produce carries our promise of excellence.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    As we look to the future, we remain dedicated to innovation while maintaining 
                    the personal touch and attention to detail that has defined us from day one.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
