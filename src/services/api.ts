// src/services/api.ts
const API_URL =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, '') as string) ||
  'http://localhost:4000/api';

class ApiClient {
  private token: string | null = localStorage.getItem('auth_token');

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private getHeaders(extra?: HeadersInit) {
    const base: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) base.Authorization = `Bearer ${this.token}`;
    return { ...base, ...(extra || {}) };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: options.method || 'GET',
        ...options,
        headers: this.getHeaders(options.headers as HeadersInit),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        // graceful JSON parsing
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      } else {
        // non-JSON responses (204, text, etc.)
        try {
          data = await res.text();
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        const message =
          (data && (data.message || data.error)) ||
          `API Error: ${res.status}`;
        throw new Error(message);
      }

      return data;
    } catch (err: any) {
      // common fetch/body-stream issues
      if (
        err instanceof TypeError &&
        String(err.message || '').includes('body stream already read')
      ) {
        throw new Error('Failed to fetch. Please try again.');
      }
      throw err;
    }
  }

  // -------------------- Auth --------------------

  // IMPORTANT: use the same endpoint as user login, then enforce admin role
  async adminLogin(email: string, password: string) {
    const res: any = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!res?.user || res.user.role !== 'admin') {
      throw new Error(res?.message || 'Admin access required');
    }
    return res;
  }

  async userLogin(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async userSignup(
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password, confirmPassword }),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    const response = await this.request('/auth/logout', { method: 'POST' });
    this.clearToken();
    return response;
  }

  // -------------------- Properties --------------------

  async getProperties(status?: string) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request(`/properties${query}`);
  }

  async getPropertiesByCity(city: string) {
    return this.request(`/properties/city/${encodeURIComponent(city)}`);
  }

  async getProperty(id: string) {
    return this.request(`/properties/${id}`);
  }

  async getAdminProperties() {
    return this.request('/properties/admin/all');
  }

  async getMyProperties() {
    return this.request('/properties/my');
  }

  async createProperty(data: any) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: string, data: any) {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string) {
    return this.request(`/properties/${id}`, { method: 'DELETE' });
  }

  // -------------------- Enquiries --------------------

  async createEnquiry(data: any) {
    return this.request('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEnquiries(status?: string) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request(`/enquiries${query}`);
  }

  async getEnquiry(id: string) {
    return this.request(`/enquiries/${id}`);
  }

  async updateEnquiryStatus(id: string, status: string) {
    return this.request(`/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteEnquiry(id: string) {
    return this.request(`/enquiries/${id}`, { method: 'DELETE' });
  }

  // -------------------- Users --------------------

  async getUsers() {
    return this.request('/users');
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async updateUserStatus(id: string, status: string) {
    return this.request(`/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, { method: 'DELETE' });
  }

  // -------------------- Pages --------------------

  async getPage(slug: string) {
    return this.request(`/pages/${encodeURIComponent(slug)}`);
  }

  async createPage(data: any) {
    return this.request('/pages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePage(id: string, data: any) {
    return this.request(`/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePage(id: string) {
    return this.request(`/pages/${id}`, { method: 'DELETE' });
  }

  async getAdminPages() {
    return this.request('/pages/admin/list');
  }

  // -------------------- Payments --------------------

  async createPaymentIntent(data: { amount: number; currency?: string; propertyId?: string; packageId?: string; notes?: any }) {
    return this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async adminMarkPaymentSuccess(id: string) {
    return this.request(`/payments/admin/${id}/mark-success`, { method: 'PUT' });
  }

  // -------------------- Transactions --------------------

  async createTransaction(data: any) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTransactions(status?: string) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return this.request(`/transactions${query}`);
  }

  async getTransaction(id: string) {
    return this.request(`/transactions/${id}`);
  }

  async updateTransactionStatus(id: string, status: string) {
    return this.request(`/transactions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateTransactionNotes(id: string, notes: string) {
    return this.request(`/transactions/${id}/notes`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    });
  }

  async getTransactionStats() {
    return this.request('/transactions/admin/stats');
  }

  // -------------------- Packages --------------------

  async getPackages() {
    return this.request('/packages');
  }

  async getPackage(id: string) {
    return this.request(`/packages/${id}`);
  }

  async createPackage(data: any) {
    return this.request('/packages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePackage(id: string, data: any) {
    return this.request(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePackage(id: string) {
    return this.request(`/packages/${id}`, { method: 'DELETE' });
  }

  async getAdminPackages() {
    return this.request('/packages/admin/all');
  }

  // -------------------- Banners --------------------

  async getBanners() {
    return this.request('/banners');
  }

  async getAllBanners() {
    return this.request('/banners/admin/all');
  }

  async createBanner(data: any) {
    return this.request('/banners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBanner(id: string, data: any) {
    return this.request(`/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBanner(id: string) {
    return this.request(`/banners/${id}`, { method: 'DELETE' });
  }

  // -------------------- Gallery --------------------

  async getGalleryItems() {
    return this.request('/gallery');
  }

  async getAllGalleryItems() {
    return this.request('/gallery/admin/all');
  }

  async createGalleryItem(data: any) {
    return this.request('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGalleryItem(id: string, data: any) {
    return this.request(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGalleryItem(id: string) {
    return this.request(`/gallery/${id}`, { method: 'DELETE' });
  }

  async reorderGalleryItems(items: Array<{ _id: string; order: number }>) {
    return this.request('/gallery/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }
}

export const api = new ApiClient();
