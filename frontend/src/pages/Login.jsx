import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { username, password });
      login(res.data.token, res.data.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || "That didn't work — check your username and password.");
    }
  };

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <div className="paper-card">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 24 }}>Log in</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn btn-primary" type="submit">Log in</button>
        </form>
        <p className="form-foot">No account? <Link to="/signup">Sign up</Link></p>

        const res = await api.post('/auth/login', {
  username,
  password
});

console.log("LOGIN RESPONSE:", res.data);

login(res.data.token, res.data.username);

console.log("TOKEN AFTER LOGIN:",
  localStorage.getItem('token'));

navigate('/');
      </div>
    </div>
  );
}

export default Login;
