import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function toLines(text) {
  return (text || '').split('\n').map((line) => line.trim()).filter(Boolean);
}

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const { username, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/recipes/${id}`)
      .then((res) => setRecipe(res.data))
      .catch(() => setError("Couldn't find that recipe."));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this recipe? This can\'t be undone.')) return;
    try {
      await api.delete(`/recipes/${id}`);
      navigate('/');
    } catch {
      setError('Could not delete recipe — try again.');
    }
  };

  if (error) return <div className="container" style={{ paddingTop: 56 }}><div className="error-msg-box">{error}</div></div>;
  if (!recipe) return <div className="container" style={{ paddingTop: 56, color: 'var(--text-muted-on-counter)' }}>Loading…</div>;

  const isOwner = isAuthenticated && username === recipe.authorUsername;
  const ingredients = toLines(recipe.ingredients);
  const steps = toLines(recipe.steps);

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <div className="paper-card wide">
        <div className="detail-header">
          {recipe.imageUrl && <img className="detail-photo" src={recipe.imageUrl} alt={recipe.title} />}
          <div>
            <h1 className="detail-title">{recipe.title}</h1>
            <p className="detail-byline">
              By {recipe.authorUsername}{recipe.cookTimeMinutes ? ` · ${recipe.cookTimeMinutes} min` : ''}
            </p>
            {isOwner && (
              <div className="detail-actions">
                <Link to={`/edit/${recipe.id}`} className="btn btn-outline-dark btn-small">Edit</Link>
                <button className="btn btn-danger btn-small" onClick={handleDelete}>Delete</button>
              </div>
            )}
          </div>
        </div>

        <div className="detail-section">
          <h2>Ingredients</h2>
          <ul className="ingredient-list">
            {ingredients.map((line, i) => <li key={i}>{line}</li>)}
          </ul>
        </div>

        <div className="detail-section">
          <h2>Steps</h2>
          <ol className="step-list">
            {steps.map((line, i) => (
              <li key={i}>
                <span className="step-num">{i + 1}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
