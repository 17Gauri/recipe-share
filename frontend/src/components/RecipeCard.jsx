import { Link } from 'react-router-dom';

function RecipeCard({ recipe, index = 0 }) {
  const tilt = index % 2 === 0 ? '-1.1deg' : '1deg';
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="recipe-card"
      style={{ '--tilt': tilt, animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {recipe.imageUrl && <img className="thumb" src={recipe.imageUrl} alt={recipe.title} />}
      <h3>{recipe.title}</h3>
      <p className="meta">
        By {recipe.authorUsername}{recipe.cookTimeMinutes ? ` · ${recipe.cookTimeMinutes} min` : ''}
      </p>
    </Link>
  );
}

export default RecipeCard;
