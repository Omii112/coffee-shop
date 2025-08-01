import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coffee, Clock, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const Index = () => {
  const features = [
    {
      icon: Coffee,
      title: 'Premium Coffee',
      description: 'Freshly roasted beans from around the world'
    },
    {
      icon: Clock,
      title: 'Quick Service',
      description: 'Order online and pick up in minutes'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Every cup crafted to perfection'
    },
    {
      icon: Award,
      title: 'Rewards Program',
      description: 'Earn points with every purchase'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-orange-900/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-amber-900 mb-6">
                Welcome to Our
                <span className="text-orange-600 block">Coffee Shop</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Experience the perfect blend of premium coffee, delicious pastries, and warm hospitality. 
                Order online for quick pickup or delivery.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                  <Link to="/menu">Order Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                  <Link to="/rewards">Join Rewards</Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop"
                alt="Coffee Shop Interior"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-gray-600">Rating</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-amber-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">Experience the difference with our premium service</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-amber-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
            <p className="text-xl mb-8 text-amber-100">
              Browse our menu and place your order for pickup or delivery
            </p>
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <Link to="/menu">View Menu</Link>
            </Button>
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

export default Index;