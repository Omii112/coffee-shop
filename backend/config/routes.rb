Rails.application.routes.draw do
  namespace :api do
    # Authentication routes
    post '/auth/login', to: 'auth#login'
    post '/auth/register', to: 'auth#register'
    
    # Menu items routes
    resources :menu_items do
      collection do
        get :by_category
        get :popular
      end
    end
    
    # Orders routes (requires authentication)
    resources :orders
    
    # Users routes (requires authentication)
    resources :users, only: [:show, :update] do
      member do
        patch :add_reward_points
      end
    end
    
    # Admin routes
    namespace :admin do
      resources :users, only: [:index, :show, :update] do
        member do
          patch :add_reward_points
        end
      end
    end
  end
end
