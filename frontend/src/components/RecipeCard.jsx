import { Link } from 'react-router-dom';

function RecipeCard({ recipe, index = 0 }) {
  const tilt = index % 2 === 0 ? '-1.1deg' : '1deg';

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="recipe-card"
      style={{
        '--tilt': tilt,
        animationDelay: `${Math.min(index, 8) * 60}ms`
      }}
    >
      {recipe.imageName && (
  <img
    className="thumb"
    src={`http://localhost:8081/uploads/${recipe.imageName}`}
    alt={recipe.title}
  />
)}

      <h3>{recipe.title}</h3>

      <p className="meta">
        By {recipe.authorUsername}
        {recipe.cookTimeMinutes
          ? ` · ${recipe.cookTimeMinutes} min`
          : ''}
      </p>
    </Link>
  );
}

export default RecipeCard;