import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 3v8a2 2 0 0 0 2 2v8M5 3a2 2 0 0 0-2 2v4M9 3v8M5 7H3" />
            <path d="M16 3c1.5 0 3 2 3 5s-1.5 5-3 5v8" />
          </svg>
          RecipeShare
        </Link>
        <div className="nav-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Browse</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create" className={isActive('/create') ? 'active' : ''}>New Recipe</Link>
              <span className="nav-greeting">Hi, {username}</span>
              <button className="btn btn-outline btn-small" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup" className="btn btn-primary btn-small">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
