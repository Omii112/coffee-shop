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