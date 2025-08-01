class User < ApplicationRecord
  has_secure_password
  
  has_many :orders, dependent: :destroy
  
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, presence: true
  validates :address, presence: true
  validates :reward_points, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  
  before_create :set_defaults
  
  def add_reward_points(points)
    update(reward_points: reward_points + points)
  end
  
  private
  
  def set_defaults
    self.reward_points ||= 0
    self.member_since ||= Time.current
    self.is_admin ||= false
  end
end
