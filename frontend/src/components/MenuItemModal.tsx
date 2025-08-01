import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiService } from '@/services/api';

interface MenuItem {
  id?: number;
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
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  menuItem?: MenuItem | null;
  mode: 'add' | 'edit';
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ isOpen, onClose, onSave, menuItem, mode }) => {
  const [formData, setFormData] = useState<MenuItem>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    sizes: [],
    customizations: [],
    popular: false
  });
  const [loading, setLoading] = useState(false);
  const [newSize, setNewSize] = useState({ name: '', price: 0 });
  const [newCustomization, setNewCustomization] = useState('');

  useEffect(() => {
    if (menuItem && mode === 'edit') {
      setFormData(menuItem);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: '',
        sizes: [],
        customizations: [],
        popular: false
      });
    }
  }, [menuItem, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'add') {
        await apiService.createMenuItem(formData);
      } else if (menuItem?.id) {
        await apiService.updateMenuItem(menuItem.id.toString(), formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSize = () => {
    if (newSize.name && newSize.price > 0) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { ...newSize }]
      }));
      setNewSize({ name: '', price: 0 });
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const addCustomization = () => {
    if (newCustomization.trim()) {
      setFormData(prev => ({
        ...prev,
        customizations: [...prev.customizations, newCustomization.trim()]
      }));
      setNewCustomization('');
    }
  };

  const removeCustomization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'add' ? 'Add New Menu Item' : 'Edit Menu Item'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coffee">Coffee</SelectItem>
                  <SelectItem value="tea">Tea</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="popular"
              checked={formData.popular}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
            />
            <Label htmlFor="popular">Popular Item</Label>
          </div>

          {/* Sizes */}
          <div>
            <Label>Sizes</Label>
            <div className="space-y-2">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={size.name}
                    onChange={(e) => {
                      const newSizes = [...formData.sizes];
                      newSizes[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, sizes: newSizes }));
                    }}
                    placeholder="Size name"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    value={size.price}
                    onChange={(e) => {
                      const newSizes = [...formData.sizes];
                      newSizes[index].price = parseFloat(e.target.value) || 0;
                      setFormData(prev => ({ ...prev, sizes: newSizes }));
                    }}
                    placeholder="Price"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeSize(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newSize.name}
                  onChange={(e) => setNewSize(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Size name"
                />
                <Input
                  type="number"
                  step="0.01"
                  value={newSize.price}
                  onChange={(e) => setNewSize(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="Price"
                />
                <Button type="button" variant="outline" size="sm" onClick={addSize}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Customizations */}
          <div>
            <Label>Customizations</Label>
            <div className="space-y-2">
              {formData.customizations.map((customization, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={customization}
                    onChange={(e) => {
                      const newCustomizations = [...formData.customizations];
                      newCustomizations[index] = e.target.value;
                      setFormData(prev => ({ ...prev, customizations: newCustomizations }));
                    }}
                    placeholder="Customization"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => removeCustomization(index)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newCustomization}
                  onChange={(e) => setNewCustomization(e.target.value)}
                  placeholder="Customization"
                />
                <Button type="button" variant="outline" size="sm" onClick={addCustomization}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : mode === 'add' ? 'Add Item' : 'Update Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemModal;