import './styles/store-about.css';

export default function StoreAbout({ category }) {
  const label = category ? `About ${category.title}` : 'About SIM Market';
  return <section className="store-about"><div className="container about-grid"><div><p className="eyebrow">{label.toUpperCase()}</p><h2>A store built around <span>useful choices.</span></h2><p>SIM Market is a focused store where the owner selects every category and product shown to customers. Browse what matters, see the available quantity, and shop with confidence.</p></div><div className="about-details"><article><i className="bi bi-shop-window"/><div><b>Curated by the owner</b><span>Only the collections this store chooses to offer.</span></div></article><article><i className="bi bi-box-seam"/><div><b>Products with real stock</b><span>Availability is visible before you add to cart.</span></div></article><article><i className="bi bi-shield-check"/><div><b>A clear shopping experience</b><span>Simple categories, clear product details, easy cart.</span></div></article></div></div></section>;
}
