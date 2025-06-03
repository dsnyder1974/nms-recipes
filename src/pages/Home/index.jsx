// src/pages/Home.jsx
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <h1>Welcome to NMS Recipes</h1>
      <p>Manage your recipe categories and more.</p>

      <section className="home-section">
        <h2>Features</h2>
        <ul>
          <li>View and manage categories</li>
          <li>Plan and organize recipes</li>
          <li>More features coming soon!</li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
