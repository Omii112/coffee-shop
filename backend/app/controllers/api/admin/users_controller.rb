class Api::Admin::UsersController < ApplicationController
  include Authenticatable
  skip_before_action :verify_authenticity_token
  before_action :ensure_admin
  before_action :set_user, only: [:show, :update, :add_reward_points]

  def index
    users = User.all.includes(:orders)
    render json: users.as_json(include: { orders: { only: [:id, :total, :status, :order_date] } })
  end

  def show
    render json: @user.as_json(include: { orders: { include: :order_items } })
  end

  def update
    if @user.update(admin_user_params)
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def add_reward_points
    points = params[:points].to_i
    @user.add_reward_points(points)
    render json: { reward_points: @user.reward_points }
  end

  private

  def ensure_admin
    unless current_user.is_admin?
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end

  def admin_user_params
    params.permit(:name, :email, :phone, :address, :is_admin, :reward_points)
  end
end 