# Coffee Shop Application

A full-stack coffee shop application with a Rails backend API and React frontend.

## Features

- **Backend (Rails API)**
  - User authentication with JWT
  - Menu item management
  - Order processing
  - User management with admin panel
  - SQLite database

- **Frontend (React + TypeScript)**
  - Modern UI with Tailwind CSS
  - Menu browsing and ordering
  - Shopping cart functionality
  - User authentication
  - Admin dashboard
  - Responsive design

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fev-hos
   ```

2. **Build and start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Default Users

The application comes with pre-seeded data including:

**Admin User:**
- Email: `admin@coffeeshop.com`
- Password: `password123`

**Customer User:**
- Email: `john@example.com`
- Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Menu Items
- `GET /api/menu_items` - Get all menu items
- `GET /api/menu_items/:id` - Get specific menu item
- `GET /api/menu_items/by_category?category=coffee` - Get items by category
- `GET /api/menu_items/popular` - Get popular items

### Orders
- `GET /api/orders` - Get user orders (authenticated)
- `POST /api/orders` - Create new order (authenticated)
- `GET /api/orders/:id` - Get specific order (authenticated)
- `PATCH /api/orders/:id` - Update order status (authenticated)

### Users
- `GET /api/users` - Get current user profile (authenticated)
- `PATCH /api/users` - Update user profile (authenticated)
- `PATCH /api/users/add_reward_points` - Add reward points (authenticated)

### Admin (requires admin privileges)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get specific user
- `PATCH /api/admin/users/:id` - Update user (admin)

## Development

### Backend Development
The Rails backend is configured with:
- Ruby 3.4.4
- Rails 8.0.2
- SQLite database
- JWT authentication
- CORS enabled for frontend communication

### Frontend Development
The React frontend is configured with:
- React 18
- TypeScript
- Vite for development
- Tailwind CSS for styling
- React Router for navigation
- React Query for API state management

## Database

The application uses SQLite for simplicity. The database is automatically created and seeded when the containers start up.

## Stopping the Application

```bash
docker-compose down
```

To remove all data (including database):
```bash
docker-compose down -v
```

## Troubleshooting

1. **Port conflicts**: Make sure ports 3000 and 5173 are available
2. **Database issues**: The database is automatically created and seeded on first run
3. **API connection**: Ensure the frontend can reach the backend at `http://localhost:3000`

## License

This project is for educational purposes. 