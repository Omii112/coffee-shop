class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :menu_item
  
  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :price, presence: true, numericality: { greater_than: 0 }
  
  def subtotal
    price * quantity
  end
end
