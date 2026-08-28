export const API_URL = import.meta.env.VITE_API_URL;
const authHeaders = (json = true) => ({ ...(json ? { 'Content-Type': 'application/json' } : {}), token: localStorage.getItem('token') || '' });

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  products: () => request('/product', { headers: authHeaders() }),
  storeConfig: () => request('/store'),
  uploads: () => request('/uploads', { headers: authHeaders() }),
  myProducts: () => request('/my/products', { headers: authHeaders() }),
  addCart: (id) => request('/cartadd', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ id }) }),
  cart: () => request('/cart', { headers: authHeaders() }),
  updateCart: (id, quantity) => request('/updatecart', { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ id, quantity }) }),
  removeCart: (id) => request('/removecart', { method: 'DELETE', headers: authHeaders(), body: JSON.stringify({ id }) }),
  login: (data, admin = false) => request(admin ? '/adminlog' : '/login', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  signup: (data) => request('/signup', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  profile: () => request('/profile', { headers: authHeaders() }),
  updateProfile: (data) => request('/update', { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  updateStoreCategories: (categories) => request('/store/categories', { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ categories }) }),
  deleteAccount: () => request('/delete', { method: 'DELETE', headers: authHeaders() }),
  users: () => request('/user', { headers: authHeaders() }),
  deleteUser: (id) => request(`/admin/delete/${id}`, { method: 'DELETE', headers: authHeaders() }),
  addUser: (data) => request('/admin/adduser', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }),
  updateUser: (id, data) => request(`/admin/update/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }),
  addProduct: (data) => request('/addProduct', { method: 'POST', headers: authHeaders(false), body: data }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', headers: authHeaders(false), body: data }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE', headers: authHeaders() })
  ,createOrder: (data) => request('/orders', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
  ,orders: () => request('/orders', { headers: authHeaders() })
  ,updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status }) })
  ,updateOrderFulfillment: (id, data) => request(`/orders/${id}/fulfillment`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) })
  ,emailOrderUpdate: (id) => request(`/orders/${id}/email`, { method: 'POST', headers: authHeaders() })
  ,myOrders: () => request('/my/orders', { headers: authHeaders() })
  ,trackOrder: (data) => request('/track-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  ,shopAssistant: (message) => request('/ai/shop-assistant', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ message }) })
  ,wishlist: () => request('/wishlist', { headers: authHeaders() })
  ,toggleWishlist: (id) => request('/wishlist/toggle', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ id }) })
  ,coupons: () => request('/coupons', { headers: authHeaders() })
  ,createCoupon: (data) => request('/coupons', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
  ,deleteCoupon: (id) => request(`/coupons/${id}`, { method: 'DELETE', headers: authHeaders() })
  ,validateCoupon: (code) => request('/coupons/validate', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ code }) })
};
