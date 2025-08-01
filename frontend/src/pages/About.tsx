import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, Mail, Coffee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const About = () => {
  const location = {
    name: 'Coffee Shop',
    address: '123 Main Street, Downtown, NY 10001',
    phone: '(555) 123-4567',
    email: 'hello@coffeeshop.com',
    hours: {
      weekdays: '6:00 AM - 9:00 PM',
      weekends: '7:00 AM - 10:00 PM'
    },
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-amber-900 mb-6">
                About Our Coffee Shop
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Founded in 2015, Coffee Shop began as a small family-owned business with a simple mission: 
                to serve exceptional coffee in a warm, welcoming environment. What started as a dream 
                has grown into a beloved community gathering place.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We're passionate about creating more than just great coffee – we're building connections, 
                fostering community, and making every visit a memorable experience. From our carefully 
                sourced beans to our handcrafted pastries, everything we do is driven by our commitment 
                to quality and customer satisfaction.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Our skilled baristas are coffee enthusiasts who take pride in crafting the perfect cup 
                every time. We source the finest beans from sustainable farms around the world and roast 
                them to perfection, ensuring every sip delivers an exceptional experience.
              </p>
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                <Link to="/menu">Try Our Coffee</Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop"
                alt="Coffee Shop Interior"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-900">9+</div>
                  <div className="text-gray-600">Years Serving</div>
                  <div className="text-gray-600">Great Coffee</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-amber-900 mb-4">Visit Us</h2>
            <p className="text-xl text-gray-600">Come experience our cozy atmosphere and exceptional coffee</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">{location.name}</h3>
                  <p className="text-amber-200">Your neighborhood coffee destination</p>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                        <p className="text-gray-700">{location.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <Phone className="h-6 w-6 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                        <p className="text-gray-700">{location.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="h-6 w-6 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                        <p className="text-gray-700">{location.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Clock className="h-6 w-6 text-amber-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Hours</h4>
                        <div className="space-y-1">
                          <p className="text-gray-700">
                            <span className="font-medium">Monday - Friday:</span><br />
                            {location.hours.weekdays}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Saturday - Sunday:</span><br />
                            {location.hours.weekends}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        className="w-full bg-amber-600 hover:bg-amber-700"
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(location.address)}`, '_blank')}
                      >
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Ready for Great Coffee?</h2>
            <p className="text-xl mb-8 text-amber-100">
              Join us for freshly brewed coffee, delicious pastries, and a warm, welcoming atmosphere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                <Link to="/menu">View Our Menu</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-amber-300 text-amber-100 hover:bg-amber-800">
                <Link to="/rewards">Join Rewards Program</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-950 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="h-6 w-6 text-amber-300" />
            <span className="text-xl font-bold">Coffee Shop</span>
          </div>
          <p className="text-amber-200">© 2024 Coffee Shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;