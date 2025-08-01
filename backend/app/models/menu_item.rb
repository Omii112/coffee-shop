class MenuItem < ApplicationRecord
  has_many :order_items, dependent: :destroy
  has_many :orders, through: :order_items
  
  validates :name, presence: true
  validates :description, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :category, presence: true, inclusion: { in: %w[coffee tea pastries sandwiches desserts] }
  validates :image, presence: true
  
  scope :by_category, ->(category) { where(category: category) }
  scope :popular, -> { where(popular: true) }
  
  def self.categories
    %w[coffee tea pastries sandwiches desserts]
  end
end
