class Api::MenuItemsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    menu_items = MenuItem.all
    render json: menu_items
  end

  def show
    menu_item = MenuItem.find(params[:id])
    render json: menu_item
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Menu item not found' }, status: :not_found
  end

  def by_category
    menu_items = MenuItem.by_category(params[:category])
    render json: menu_items
  end

  def popular
    menu_items = MenuItem.popular
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
    menu_item = MenuItem.find(params[:id])
    
    if menu_item.update(menu_item_params)
      render json: menu_item
    else
      render json: { errors: menu_item.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Menu item not found' }, status: :not_found
  end

  def destroy
    menu_item = MenuItem.find(params[:id])
    menu_item.destroy
    head :no_content
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Menu item not found' }, status: :not_found
  end

  private

  def menu_item_params
    params.permit(:name, :description, :price, :image, :category, :popular, sizes: [], customizations: [])
  end
end
