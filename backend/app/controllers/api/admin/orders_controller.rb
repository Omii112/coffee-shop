class Api::Admin::OrdersController < ApplicationController
  include Authenticatable
  skip_before_action :verify_authenticity_token
  before_action :ensure_admin
  before_action :set_order, only: [:show, :update]

  def index
    orders = Order.includes(:user, :order_items, :menu_items).recent
    render json: orders.as_json(include: { 
      user: { only: [:id, :name, :email] }, 
      order_items: { include: :menu_item } 
    })
  end

  def show
    render json: @order.as_json(include: { 
      user: { only: [:id, :name, :email] }, 
      order_items: { include: :menu_item } 
    })
  end

  def update
    if @order.update(order_params)
      render json: @order.as_json(include: { 
        user: { only: [:id, :name, :email] }, 
        order_items: { include: :menu_item } 
      })
    else
      render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def analytics
    # Get analytics data
    total_revenue = Order.where(status: 'delivered').sum(:total)
    total_orders = Order.count
    pending_orders = Order.where(status: 'preparing').count
    ready_orders = Order.where(status: 'ready').count
    delivered_orders = Order.where(status: 'delivered').count
    
    # Monthly sales data for the last 6 months
    monthly_sales = Order.where(status: 'delivered')
                        .where('order_date >= ?', 6.months.ago)
                        .group("strftime('%Y-%m', order_date)")
                        .sum(:total)
                        .map { |month, total| { month: month, sales: total.to_f } }
                        .sort_by { |data| data[:month] }

    # Monthly orders data
    monthly_orders = Order.where('order_date >= ?', 6.months.ago)
                         .group("strftime('%Y-%m', order_date)")
                         .count
                         .map { |month, count| { month: month, orders: count } }
                         .sort_by { |data| data[:month] }

    # Recent orders (last 5)
    recent_orders = Order.includes(:user).order(order_date: :desc).limit(5)

    # Top customers by total spent
    top_customers = User.joins(:orders)
                       .where(orders: { status: 'delivered' })
                       .group('users.id')
                       .select('users.*, SUM(orders.total) as total_spent')
                       .order('total_spent DESC')
                       .limit(5)

    render json: {
      total_revenue: total_revenue,
      total_orders: total_orders,
      pending_orders: pending_orders,
      ready_orders: ready_orders,
      delivered_orders: delivered_orders,
      monthly_sales: monthly_sales,
      monthly_orders: monthly_orders,
      recent_orders: recent_orders.as_json(include: { user: { only: [:id, :name, :email] } }),
      top_customers: top_customers.as_json
    }
  end

  private

  def ensure_admin
    unless current_user.is_admin?
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def set_order
    @order = Order.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Order not found' }, status: :not_found
  end

  def order_params
    params.permit(:status)
  end
end 