Rails.application.routes.draw do
  namespace :api do
    # Authentication routes
    post '/auth/login', to: 'auth#login'
    post '/auth/register', to: 'auth#register'
    get '/auth/list_users', to: 'auth#list_users'
    post '/auth/delete_user', to: 'auth#delete_user'
    
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
    get '/users/me', to: 'users#me'
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
                resources :menu_items, only: [:index, :create, :update, :destroy]
                resources :orders, only: [:index, :show, :update] do
                  collection do
                    get :analytics
                  end
                end
              end
  end
end
