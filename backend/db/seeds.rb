# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create sample users
admin_user = User.find_or_create_by!(email: 'admin@coffeeshop.com') do |user|
  user.name = 'Admin User'
  user.phone = '+1234567891'
  user.address = '456 Admin Ave, City, State'
  user.password = 'password123'
  user.is_admin = true
  user.reward_points = 0
  user.member_since = Date.new(2022, 1, 1)
end

customer_user = User.find_or_create_by!(email: 'john@example.com') do |user|
  user.name = 'John Doe'
  user.phone = '+1234567890'
  user.address = '123 Main St, City, State'
  user.password = 'password123'
  user.is_admin = false
  user.reward_points = 150
  user.member_since = Date.new(2023, 1, 15)
end

# Create menu items
menu_items_data = [
  # Coffee
  {
    name: 'Espresso',
    description: 'Rich and bold espresso shot',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=300&h=200&fit=crop',
    category: 'coffee',
    sizes: [
      { name: 'Single', price: 2.50 },
      { name: 'Double', price: 3.50 }
    ],
    customizations: ['Extra shot', 'Decaf', 'Sugar', 'Honey'],
    popular: false
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=crop',
    category: 'coffee',
    sizes: [
      { name: 'Small', price: 4.50 },
      { name: 'Medium', price: 5.50 },
      { name: 'Large', price: 6.50 }
    ],
    customizations: ['Extra shot', 'Decaf', 'Oat milk', 'Almond milk', 'Soy milk', 'Extra foam'],
    popular: true
  },
  {
    name: 'Latte',
    description: 'Smooth espresso with steamed milk',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=300&h=200&fit=crop',
    category: 'coffee',
    sizes: [
      { name: 'Small', price: 5.00 },
      { name: 'Medium', price: 6.00 },
      { name: 'Large', price: 7.00 }
    ],
    customizations: ['Extra shot', 'Decaf', 'Vanilla syrup', 'Caramel syrup', 'Oat milk', 'Almond milk'],
    popular: true
  },
  {
    name: 'Americano',
    description: 'Espresso with hot water',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=300&h=200&fit=crop',
    category: 'coffee',
    sizes: [
      { name: 'Small', price: 3.50 },
      { name: 'Medium', price: 4.50 },
      { name: 'Large', price: 5.50 }
    ],
    customizations: ['Extra shot', 'Decaf', 'Sugar', 'Cream'],
    popular: false
  },
  
  # Tea
  {
    name: 'Earl Grey Tea',
    description: 'Classic bergamot-flavored black tea',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b3fd34?w=300&h=200&fit=crop',
    category: 'tea',
    sizes: [
      { name: 'Small', price: 3.00 },
      { name: 'Large', price: 4.00 }
    ],
    customizations: ['Honey', 'Lemon', 'Milk', 'Sugar'],
    popular: false
  },
  {
    name: 'Green Tea',
    description: 'Fresh and light green tea',
    price: 2.75,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
    category: 'tea',
    sizes: [
      { name: 'Small', price: 2.75 },
      { name: 'Large', price: 3.75 }
    ],
    customizations: ['Honey', 'Lemon', 'Mint'],
    popular: false
  },

  # Pastries
  {
    name: 'Croissant',
    description: 'Buttery, flaky French pastry',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade2a?w=300&h=200&fit=crop',
    category: 'pastries',
    sizes: [],
    customizations: ['Butter', 'Jam', 'Honey'],
    popular: true
  },
  {
    name: 'Blueberry Muffin',
    description: 'Fresh baked muffin with blueberries',
    price: 4.00,
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=300&h=200&fit=crop',
    category: 'pastries',
    sizes: [],
    customizations: ['Butter', 'Warmed'],
    popular: false
  },
  {
    name: 'Cinnamon Roll',
    description: 'Sweet pastry with cinnamon and glaze',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
    category: 'pastries',
    sizes: [],
    customizations: ['Extra glaze', 'Warmed'],
    popular: false
  },

  # Sandwiches
  {
    name: 'Turkey Club',
    description: 'Turkey, bacon, lettuce, tomato on toasted bread',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop',
    category: 'sandwiches',
    sizes: [],
    customizations: ['No bacon', 'Extra turkey', 'Avocado', 'Mayo', 'Mustard'],
    popular: false
  },
  {
    name: 'Grilled Cheese',
    description: 'Classic grilled cheese sandwich',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&h=200&fit=crop',
    category: 'sandwiches',
    sizes: [],
    customizations: ['Tomato', 'Bacon', 'Extra cheese'],
    popular: false
  },

  # Desserts
  {
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake slice',
    price: 5.50,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
    category: 'desserts',
    sizes: [],
    customizations: ['Ice cream', 'Whipped cream'],
    popular: false
  },
  {
    name: 'Cheesecake',
    description: 'Creamy New York style cheesecake',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop',
    category: 'desserts',
    sizes: [],
    customizations: ['Berry sauce', 'Whipped cream'],
    popular: true
  }
]

menu_items_data.each do |item_data|
  MenuItem.find_or_create_by!(name: item_data[:name]) do |item|
    item.description = item_data[:description]
    item.price = item_data[:price]
    item.image = item_data[:image]
    item.category = item_data[:category]
    item.sizes = item_data[:sizes]
    item.customizations = item_data[:customizations]
    item.popular = item_data[:popular]
  end
end

puts "Seed data created successfully!"
puts "Admin user: admin@coffeeshop.com / password123"
puts "Customer user: john@example.com / password123"
