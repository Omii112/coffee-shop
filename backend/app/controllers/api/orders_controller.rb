class Api::OrdersController < ApplicationController
  include Authenticatable
  skip_before_action :verify_authenticity_token

  def index
    if current_user.is_admin?
      orders = Order.includes(:user, :order_items, :menu_items).recent
    else
      orders = current_user.orders.includes(:order_items, :menu_items).recent
    end
    render json: orders.as_json(include: { user: { only: [:id, :name, :email] }, order_items: { include: :menu_item } })
  end

  def show
    order = find_order
    render json: order.as_json(include: { user: { only: [:id, :name, :email] }, order_items: { include: :menu_item } })
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Order not found' }, status: :not_found
  end

  def create
    order = current_user.orders.build(status: 'pending')
    
    # Add items from cart first
    params[:items].each do |item_data|
      menu_item = MenuItem.find(item_data[:menu_item_id])
      order_item = order.add_item(menu_item, 
        quantity: item_data[:quantity], 
        size: item_data[:size], 
        customizations: item_data[:customizations] || []
      )
      Rails.logger.info "Added item: #{order_item.inspect}"
    end
    
    # Calculate total before saving
    order.calculate_total
    Rails.logger.info "Order total: #{order.total}"
    Rails.logger.info "Order valid? #{order.valid?}"
    Rails.logger.info "Order errors: #{order.errors.full_messages}" unless order.valid?
    
    if order.save
      # Add reward points
      points_earned = order.total.floor
      current_user.add_reward_points(points_earned)
      
      render json: {
        order: order.as_json(include: { order_items: { include: :menu_item } }),
        points_earned: points_earned
      }, status: :created
    else
      Rails.logger.error "Order validation failed: #{order.errors.full_messages}"
      render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    order = find_order
    
    if order.update(order_params)
      render json: order.as_json(include: { order_items: { include: :menu_item } })
    else
      render json: { errors: order.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Order not found' }, status: :not_found
  end

  def destroy
    order = find_order
    order.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Order not found' }, status: :not_found
  end

  private

  def find_order
    if current_user.is_admin?
      Order.find(params[:id])
    else
      current_user.orders.find(params[:id])
    end
  end

  def order_params
    params.permit(:status)
  end
end
