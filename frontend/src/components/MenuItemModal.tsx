import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: Array<{ name: string; price: number }>;
  customizations: string[];
  popular: boolean;
}

interface MenuItemModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, size?: string, customizations?: string[]) => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ item, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState(item.sizes?.[0]?.name || '');
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const getCurrentPrice = () => {
    const sizePrice = item.sizes?.find(size => size.name === selectedSize)?.price || item.price;
    return sizePrice;
  };

  const handleCustomizationChange = (customization: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomizations([...selectedCustomizations, customization]);
    } else {
      setSelectedCustomizations(selectedCustomizations.filter(c => c !== customization));
    }
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedSize, selectedCustomizations);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-amber-900">{item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-48 object-cover rounded-lg"
          />

          <p className="text-gray-600">{item.description}</p>

          {item.sizes && item.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                {item.sizes.map((size) => (
                  <div key={size.name} className="flex items-center space-x-2">
                    <RadioGroupItem value={size.name} id={size.name} />
                    <Label htmlFor={size.name} className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>{size.name}</span>
                        <span className="font-semibold">${size.price.toFixed(2)}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {item.customizations && item.customizations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Customizations</h3>
              <div className="space-y-2">
                {item.customizations.map((customization) => (
                  <div key={customization} className="flex items-center space-x-2">
                    <Checkbox
                      id={customization}
                      checked={selectedCustomizations.includes(customization)}
                      onCheckedChange={(checked) => 
                        handleCustomizationChange(customization, checked as boolean)
                      }
                    />
                    <Label htmlFor={customization} className="flex-1 cursor-pointer">
                      {customization}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-amber-600">
                ${(getCurrentPrice() * quantity).toFixed(2)}
              </span>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Add to Cart - ${(getCurrentPrice() * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal;