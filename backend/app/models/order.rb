class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :menu_items, through: :order_items
  
  validates :total, presence: true, numericality: { greater_than: 0 }
  validates :status, presence: true, inclusion: { in: %w[pending preparing ready delivered completed cancelled] }
  validates :order_date, presence: true
  
  before_create :set_order_date
  
  scope :recent, -> { order(order_date: :desc) }
  scope :by_status, ->(status) { where(status: status) }
  
  def add_item(menu_item, quantity: 1, size: nil, customizations: [])
    order_items.build(
      menu_item: menu_item,
      quantity: quantity,
      price: menu_item.price,
      size: size,
      customizations: customizations
    )
  end
  
  def calculate_total
    self.total = order_items.sum(&:subtotal)
    self.order_date ||= Time.current
  end
  
  def subtotal
    order_items.sum(&:subtotal)
  end
  
  def tax
    subtotal * 0.08
  end
  
  def grand_total
    subtotal + tax
  end
  
  private
  
  def set_order_date
    self.order_date ||= Time.current
  end
end
