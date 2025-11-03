import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Textile OEM Platform</title>
        <meta name="description" content="Get in touch with TextileOEM for inquiries about manufacturing, partnerships, or support. We're here to help." />
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
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Get In Touch</h1>
                <p className="text-lg text-muted-foreground">
                  Have a question or ready to start your manufacturing project? We're here to help.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contact Content */}
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-lg p-8"
                >
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company Name
                      </label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <div className="space-y-6">
                      {[
                        {
                          icon: Mail,
                          title: 'Email',
                          content: 'info@textileoem.com',
                          link: 'mailto:info@textileoem.com',
                        },
                        {
                          icon: Phone,
                          title: 'Phone',
                          content: '+1 (555) 123-4567',
                          link: 'tel:+15551234567',
                        },
                        {
                          icon: MapPin,
                          title: 'Address',
                          content: 'Mumbai, Maharashtra, India',
                        },
                        {
                          icon: Clock,
                          title: 'Business Hours',
                          content: 'Mon-Fri: 9:00 AM - 6:00 PM IST',
                        },
                      ].map((item) => (
                        <div key={item.title} className="flex gap-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium mb-1">{item.title}</div>
                            {item.link ? (
                              <a
                                href={item.link}
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                {item.content}
                              </a>
                            ) : (
                              <div className="text-muted-foreground">{item.content}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-3">Looking for Customer Support?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Existing clients can access 24/7 support through the operations portal.
                    </p>
                    <Button variant="outline" className="w-full">
                      Access Portal
                    </Button>
                  </div>
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

export default Contact;
