class Api::UsersController < ApplicationController
  include Authenticatable
  skip_before_action :verify_authenticity_token

  def show
    render json: current_user
  end

  def update
    if current_user.update(user_params)
      render json: current_user
    else
      render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def add_reward_points
    points = params[:points].to_i
    current_user.add_reward_points(points)
    render json: { reward_points: current_user.reward_points }
  end

  # Admin only actions
  def index
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user.is_admin?
    
    users = User.all
    render json: users
  end

  def admin_show
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user.is_admin?
    
    user = User.find(params[:id])
    render json: user.as_json(include: { orders: { include: :order_items } })
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end

  def admin_update
    return render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user.is_admin?
    
    user = User.find(params[:id])
    if user.update(admin_user_params)
      render json: user
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'User not found' }, status: :not_found
  end

  private

  def user_params
    params.permit(:name, :phone, :address)
  end

  def admin_user_params
    params.permit(:name, :email, :phone, :address, :is_admin, :reward_points)
  end
end
