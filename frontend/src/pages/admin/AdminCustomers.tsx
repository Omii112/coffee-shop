import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mail, Phone, MapPin, Star, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminCustomers = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Mock customers data
  const customers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, City, State',
      rewardPoints: 150,
      totalOrders: 12,
      totalSpent: 156.75,
      memberSince: '2023-01-15',
      tier: 'Silver'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave, City, State',
      rewardPoints: 320,
      totalOrders: 28,
      totalSpent: 342.50,
      memberSince: '2022-08-22',
      tier: 'Gold'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1234567892',
      address: '789 Pine St, City, State',
      rewardPoints: 75,
      totalOrders: 6,
      totalSpent: 78.25,
      memberSince: '2023-11-10',
      tier: 'Bronze'
    }
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return 'bg-amber-600';
      case 'Silver':
        return 'bg-gray-400';
      case 'Gold':
        return 'bg-yellow-500';
      case 'Platinum':
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">View and manage customer information</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getTierColor(customer.tier)} text-white`}>
                          <Star className="h-3 w-3 mr-1" />
                          {customer.tier}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {customer.rewardPoints} points
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {customer.email}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {customer.phone}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {customer.address}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Member since {new Date(customer.memberSince).toLocaleDateString()}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{customer.totalOrders}</div>
                      <div className="text-xs text-gray-600">Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-amber-900">${customer.totalSpent.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{customer.rewardPoints}</div>
                      <div className="text-xs text-gray-600">Points</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomers;