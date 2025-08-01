class Api::Admin::MenuItemsController < ApplicationController
  include Authenticatable
  skip_before_action :verify_authenticity_token
  before_action :ensure_admin
  before_action :set_menu_item, only: [:update, :destroy]

  def index
    menu_items = MenuItem.all
    render json: menu_items
  end

  def create
    menu_item = MenuItem.new(menu_item_params)
    
    if menu_item.save
      render json: menu_item, status: :created
    else
      render json: { errors: menu_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @menu_item.update(menu_item_params)
      render json: @menu_item
    else
      render json: { errors: @menu_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @menu_item.destroy
    head :no_content
  end

  private

  def ensure_admin
    unless current_user.is_admin?
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def set_menu_item
    @menu_item = MenuItem.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Menu item not found' }, status: :not_found
  end

  def menu_item_params
    params.permit(:name, :description, :price, :image, :category, :popular, sizes: [], customizations: [])
  end
end 