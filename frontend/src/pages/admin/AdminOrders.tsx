import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { apiService } from '@/services/api';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  size?: string;
  customizations?: string[];
  menu_item: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

interface Order {
  id: number;
  total: number;
  status: string;
  order_date: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  order_items: OrderItem[];
}

interface Analytics {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  ready_orders: number;
  delivered_orders: number;
  monthly_sales: Array<{ month: string; sales: number }>;
  monthly_orders: Array<{ month: string; orders: number }>;
  recent_orders: Order[];
  top_customers: Array<{ id: number; name: string; email: string; total_spent: number }>;
}

const AdminOrders = () => {
  const { isAdmin, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
      loadAnalytics();
    }
  }, [isAdmin]);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const ordersData = await apiService.getAdminOrders() as Order[];
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analyticsData = await apiService.getAdminAnalytics() as Analytics;
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'preparing':
        return <AlertCircle className="h-4 w-4" />;
      case 'ready':
        return <Package className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-500';
      case 'preparing':
        return 'bg-yellow-500';
      case 'ready':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return currentStatus;
    }
  };

  const getStatusButtonText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'Start Preparing';
      case 'preparing':
        return 'Mark Ready';
      case 'ready':
        return 'Mark Delivered';
      default:
        return 'Update Status';
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await apiService.updateAdminOrderStatus(orderId, newStatus);
      await loadOrders(); // Reload the orders
      await loadAnalytics(); // Reload analytics
      setIsStatusUpdateOpen(false);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${Number(analytics?.total_revenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Orders',
      value: analytics?.total_orders?.toString() || '0',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Pending Orders',
      value: analytics?.pending_orders?.toString() || '0',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Ready Orders',
      value: analytics?.ready_orders?.toString() || '0',
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Manage and track customer orders</p>
        </div>

        {/* Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p>Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                            <p className="text-gray-600">
                              {order.user?.name} • {order.user?.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.order_date).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {order.order_items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <span>{item.quantity}x {item.menu_item?.name || 'Unknown Item'}</span>
                              <span className="font-semibold">${Number(item.price).toFixed(2)}</span>
                            </div>
                          ))}
                          {order.order_items && order.order_items.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{order.order_items.length - 3} more items
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center border-t pt-4">
                                              <div className="font-bold text-lg">
                      Total: <span className="text-amber-900">${Number(order.total || 0).toFixed(2)}</span>
                    </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsOrderDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {order.status !== 'delivered' && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsStatusUpdateOpen(true);
                                }}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {getStatusButtonText(order.status)}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <>
                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.recent_orders.map((order) => (
                        <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-gray-600">{order.user.name}</p>
                          </div>
                                                     <div className="text-right">
                             <p className="font-semibold">${Number(order.total || 0).toFixed(2)}</p>
                             <Badge className={getStatusColor(order.status)}>
                               {order.status}
                             </Badge>
                           </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Customers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.top_customers.map((customer, index) => (
                        <div key={customer.id} className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                              <span className="text-amber-600 font-semibold">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-semibold">{customer.name}</p>
                              <p className="text-sm text-gray-600">{customer.email}</p>
                            </div>
                          </div>
                                                     <div className="text-right">
                             <p className="font-semibold text-green-600">
                               ${Number(customer.total_spent || 0).toFixed(2)}
                             </p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Order Detail Modal */}
        <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Customer Information</h4>
                    <p>Name: {selectedOrder.user.name}</p>
                    <p>Email: {selectedOrder.user.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Order Information</h4>
                    <p>Date: {new Date(selectedOrder.order_date).toLocaleString()}</p>
                    <p>Status: <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.order_items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 border rounded">
                        <div>
                          <p className="font-semibold">{item.menu_item.name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                            {item.customizations && item.customizations.length > 0 && ` • Customizations: ${item.customizations.join(', ')}`}
                          </p>
                        </div>
                        <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                                   <div className="border-t pt-4">
                     <div className="flex justify-between items-center">
                       <span className="text-lg font-bold">Total:</span>
                       <span className="text-xl font-bold text-amber-900">${Number(selectedOrder.total || 0).toFixed(2)}</span>
                     </div>
                   </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Update Modal */}
        <Dialog open={isStatusUpdateOpen} onOpenChange={setIsStatusUpdateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <p>Current Status: <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge></p>
                <p>New Status: <Badge className={getStatusColor(getNextStatus(selectedOrder.status))}>{getNextStatus(selectedOrder.status)}</Badge></p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsStatusUpdateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => updateOrderStatus(selectedOrder.id.toString(), getNextStatus(selectedOrder.status))}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? 'Updating...' : 'Update Status'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;