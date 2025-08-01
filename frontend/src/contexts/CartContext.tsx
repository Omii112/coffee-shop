import React, { createContext, useContext, useState } from 'react';
import { apiService } from '@/services/api';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  size?: string;
  customizations?: string[];
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  checkout: () => Promise<{ success: boolean; pointsEarned?: number; error?: string }>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(item => 
        item.id === newItem.id && 
        item.size === newItem.size &&
        JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations)
      );
      
      if (existingItem) {
        return prev.map(item =>
          item === existingItem 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const checkout = async (): Promise<{ success: boolean; pointsEarned?: number; error?: string }> => {
    try {
      const orderItems = items.map(item => ({
        menu_item_id: parseInt(item.id),
        quantity: item.quantity,
        size: item.size,
        customizations: item.customizations || []
      }));

      const response = await apiService.createOrder(orderItems) as { points_earned: number };
      
      clearCart();
      
      return {
        success: true,
        pointsEarned: response.points_earned
      };
    } catch (error) {
      console.error('Checkout failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Checkout failed'
      };
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};