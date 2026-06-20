import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import RecipeCard from '../components/RecipeCard.jsx';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/recipes')
      .then((res) => setRecipes(res.data))
      .catch(() => setError("Couldn't reach the kitchen — make sure the backend is running on port 8080."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="page-intro">
        <span className="eyebrow">Community recipes</span>
        <h1>What's cooking?</h1>
        <p>Browse recipes shared by other home cooks, or pin up one of your own.</p>
        <div className="rule" />
      </div>

      {loading && <p style={{ color: 'var(--text-muted-on-counter)' }}>Loading recipes…</p>}
      {error && <div className="error-msg-box">{error}</div>}
      {!loading && !error && recipes.length === 0 && (
        <div className="empty-state">No recipes yet — be the first to pin one up.</div>
      )}

      <div className="recipe-grid">
        {recipes.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
      </div>
    </div>
  );
}

export default Home;
