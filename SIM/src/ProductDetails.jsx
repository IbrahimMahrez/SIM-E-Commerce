import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { api, API_URL } from './api';
import './styles/product-details.css';

export default function ProductDetails() {
  const { id } = useParams(); const [product, setProduct] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.products().then((result) => setProduct((result.products || []).find((item) => item.id === id) || null)).catch((err) => setError(err.message)); }, [id]);
  const add = async () => { try { await api.addCart(product.id); } catch (err) { setError(err.message); } };
  if (error && !product) return <section className="detail-page"><div className="container"><p>{error}</p><NavLink to="/shop">Back to shop</NavLink></div></section>;
  if (!product) return <section className="detail-page"><div className="container text-light">Loading product...</div></section>;
  return <section className="detail-page"><div className="container detail-grid"><div className="detail-image"><img src={product.image ? `${API_URL}/uploads/${product.image}` : '/store-assets/electronics/pexels-doouglasma-16247542.jpg'} alt={product.title}/>{product.discountPercent>0&&<b>{product.discountPercent}% OFF</b>}</div><div className="detail-content"><NavLink className="back-link" to="/shop"><i className="bi bi-arrow-left"/> Back to products</NavLink><p className="eyebrow">{product.category}</p><h1>{product.title}</h1><p className="detail-description">{product.description}</p><div className="detail-price"><strong>${product.price}</strong>{product.discountPercent>0&&<del>${product.originalPrice}</del>}</div><p className="detail-stock"><i className="bi bi-check-circle-fill"/> {product.quantity} pieces available now</p><button disabled={!product.isAvailable} onClick={add} className="detail-add"><i className="bi bi-cart-plus"/> {product.isAvailable ? 'Add to cart' : 'Out of stock'}</button>{error&&<p className="detail-error">{error}</p>}<div className="detail-perks"><span><i className="bi bi-shield-check"/> Secure order</span><span><i className="bi bi-arrow-repeat"/> Easy quantity update</span></div></div></div></section>;
}
