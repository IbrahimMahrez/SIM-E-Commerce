import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './styles/home-sections.css';

const copy = {
  electronics: ['Smarter choices, every day.', 'Useful technology and mobile essentials that keep pace with work, play, and everything in between.', 'pexels-kawerodriguess-15977087.jpg'],
  clothes: ['Style that feels like you.', 'Discover easy pieces for everyday plans, comfortable moments, and a wardrobe with personality.', 'pexels-la-photography-212558539-13258318.jpg'],
  shoes: ['Step out with confidence.', 'Shoes and bags that bring the finishing touch to every outfit, commute, and weekend plan.', 'pexels-vitoria-zanella-197678510-35335645.jpg'],
  games: ['Your next great play.', 'Find games and accessories for relaxed nights, big wins, and fun shared with people you love.', 'pexels-karola-g-7296767.jpg'],
  sports: ['Make every move count.', 'Explore fitness essentials for your routine, your goals, and the small wins that become progress.', 'pexels-franco-monsalvo-252430633-38615869.jpg'],
  beauty: ['Care that feels personal.', 'A curated beauty collection for daily rituals, confident moments, and your kind of glow.', 'pexels-kuiyibo-16938818.jpg'],
  home: ['A home made for living.', 'Thoughtful home and kitchen finds that make your everyday space feel warmer and easier.', 'pexels-d-huy-hoang-163344088-10847178.jpg']
};

export default function HomeSections({ categories }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug);
  useEffect(() => setActiveSlug(categories[0]?.slug), [categories]);
  const active = categories.find((category) => category.slug === activeSlug) || categories[0];
  if (!active) return null;
  const [title, text, image] = copy[active.slug] || [active.title, 'Explore this collection.', active.image];
  const imageUrl = `/store-assets/${active.slug}/${image}`;

  return <>
    <section className="collection-switcher">
      <div className="container">
        <div className="switcher-heading"><div><p className="eyebrow">PICK A COLLECTION</p><h2>Made to change with what you <span>choose.</span></h2></div><p>Choose a category to explore its own story, image, and collection.</p></div>
        <div className="switcher-tabs">{categories.map((category, index) => <button className={active.slug === category.slug ? 'active' : ''} key={category.slug} onClick={() => setActiveSlug(category.slug)}><b>0{index + 1}</b>{category.title}<i className="bi bi-arrow-up-right"/></button>)}</div>
        <article className="switcher-display" key={active.slug}><div className="switcher-photo"><img src={imageUrl} alt={active.title}/><span>{active.title}</span></div><div className="switcher-content"><p className="eyebrow">SELECTED COLLECTION</p><h2>{title}</h2><p>{text}</p><div className="switcher-points"><span><i className="bi bi-stars"/> Curated selection</span><span><i className="bi bi-box2-heart"/> Clear stock details</span></div><NavLink to={`/shop/${active.slug}`}>Explore {active.title} <i className="bi bi-arrow-right"/></NavLink></div></article>
      </div>
    </section>
    <section className="shopping-notes"><div className="container notes-grid"><article><i className="bi bi-lightning-charge"/><div><b>Quick to browse</b><span>Clear categories, no clutter.</span></div></article><article><i className="bi bi-patch-check"/><div><b>Chosen by the store</b><span>Collections selected for this shop.</span></div></article><article><i className="bi bi-arrow-repeat"/><div><b>Always evolving</b><span>Come back for new finds.</span></div></article></div></section>
    <section className="home-cta"><div className="container"><i className="bi bi-bag-heart-fill"/><p className="eyebrow">YOUR NEXT FIND IS HERE</p><h2>Browse the full store,<br/><span>your way.</span></h2><NavLink to="/shop">Shop all products <i className="bi bi-arrow-right"/></NavLink></div></section>
  </>;
}
