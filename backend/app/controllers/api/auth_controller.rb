class Api::AuthController < ApplicationController
  skip_before_action :verify_authenticity_token

  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = JwtService.encode({ user_id: user.id })
      render json: {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          is_admin: user.is_admin,
          reward_points: user.reward_points,
          member_since: user.member_since
        }
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def register
    user = User.new(user_params)
    
    if user.save
      token = JwtService.encode({ user_id: user.id })
      render json: {
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          is_admin: user.is_admin,
          reward_points: user.reward_points,
          member_since: user.member_since
        }
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Temporary endpoint to list users (for debugging)
  def list_users
    users = User.all.map { |user| { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin } }
    render json: users
  end

  # Temporary endpoint to delete user (for debugging)
  def delete_user
    user = User.find_by(email: params[:email])
    if user
      user.destroy
      render json: { message: 'User deleted successfully' }
    else
      render json: { error: 'User not found' }, status: :not_found
    end
  end

  def user_params
    params.permit(:name, :email, :phone, :address, :password, :password_confirmation)
  end
end
