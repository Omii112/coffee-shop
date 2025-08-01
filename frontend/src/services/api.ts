const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: this.getHeaders(),
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    password_confirmation: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Menu Items
  async getMenuItems() {
    return this.request('/menu_items');
  }

  async getMenuItem(id: string) {
    return this.request(`/menu_items/${id}`);
  }

  async getMenuByCategory(category: string) {
    return this.request(`/menu_items/by_category?category=${category}`);
  }

  async getPopularItems() {
    return this.request('/menu_items/popular');
  }

  // Orders
  async createOrder(items: Array<{
    menu_item_id: number;
    quantity: number;
    size?: string;
    customizations?: string[];
  }>) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Users
  async getCurrentUser() {
    return this.request('/users');
  }

  async updateUser(userData: { name?: string; phone?: string; address?: string }) {
    return this.request('/users', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async addRewardPoints(points: number) {
    return this.request('/users/add_reward_points', {
      method: 'PATCH',
      body: JSON.stringify({ points }),
    });
  }

  // Admin endpoints
  async getAllUsers() {
    return this.request('/admin/users');
  }

  async getUser(id: string) {
    return this.request(`/admin/users/${id}`);
  }

  async updateUserAdmin(id: string, userData: { name?: string; email?: string; phone?: string; address?: string; is_admin?: boolean; reward_points?: number }) {
    return this.request(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }
}

export const apiService = new ApiService(); 