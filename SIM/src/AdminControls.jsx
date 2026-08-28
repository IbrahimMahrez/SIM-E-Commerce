import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import './styles/admin-controls.css';

export default function AdminControls({ products, categories, isAdmin, toast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); api.users().then((result) => setUsers(result.users || [])).catch((error) => toast(error.message, 'error')).finally(() => setLoading(false)); };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);
  const chart = useMemo(() => categories.map((category) => ({ ...category, value: products.filter((product) => product.category === category.slug).reduce((sum, product) => sum + Math.max(0, Number(product.price || 0) - Number(product.cost || 0)) * Number(product.quantity || 0), 0) })).filter((item) => item.value > 0), [products, categories]);
  const max = Math.max(...chart.map((item) => item.value), 1);
  const remove = async (user) => { if (user.role === 'admin') return toast('The admin account cannot be deleted', 'error'); if (!confirm(`Delete ${user.username}?`)) return; try { await api.deleteUser(user._id); toast('User deleted'); load(); } catch (error) { toast(error.message, 'error'); } };
  if (!isAdmin) return null;
  return <>
    <section className="admin-section admin-insights mt-4"><div className="admin-section-title"><div><p className="eyebrow">STORE PERFORMANCE</p><h2>Estimated <span>profit</span></h2></div><small><i className="bi bi-info-circle"/> (Sale price − cost) × stock</small></div>{chart.length ? <div className="revenue-chart">{chart.map((item) => <div className="chart-row" key={item.slug}><div><span>{item.title}</span><b>${item.value.toFixed(0)}</b></div><div className="chart-track"><i style={{ width: `${Math.max(8, item.value / max * 100)}%` }}/></div></div>)}</div> : <p className="text-secondary m-0">Add products with cost details to see your chart.</p>}</section>
    <section className="admin-section users-section mt-4"><div className="admin-section-title"><div><p className="eyebrow">CUSTOMERS</p><h2>Manage <span>users</span></h2></div><button className="refresh-users" onClick={load}><i className="bi bi-arrow-clockwise"/> Refresh</button></div>{loading ? <p className="text-secondary">Loading users...</p> : <div className="table-responsive"><table className="table table-dark users-table mb-0"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Categories</th><th></th></tr></thead><tbody>{users.map((user) => <tr key={user._id}><td><div className="user-name"><span>{user.username?.slice(0, 1).toUpperCase()}</span>{user.username}</div></td><td>{user.email}</td><td><b className={`user-role ${user.role}`}>{user.role}</b></td><td>{user.storeCategories?.length || 0}</td><td><button disabled={user.role === 'admin'} className="delete-user" onClick={() => remove(user)}><i className="bi bi-trash3"/> Delete</button></td></tr>)}</tbody></table>{!users.length && <p className="text-secondary text-center py-4 mb-0">No users found.</p>}</div>}</section>
  </>;
}
