import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';

function RecipeForm({ editMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', ingredients: '', steps: '', cookTimeMinutes: '', imageUrl: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editMode && id) {
      api.get(`/recipes/${id}`).then((res) => setForm({
        title: res.data.title,
        ingredients: res.data.ingredients,
        steps: res.data.steps,
        cookTimeMinutes: res.data.cookTimeMinutes || '',
        imageUrl: res.data.imageUrl || '',
      }));
    }
  }, [editMode, id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, cookTimeMinutes: form.cookTimeMinutes ? Number(form.cookTimeMinutes) : null };
    try {
      if (editMode) {
        await api.put(`/recipes/${id}`, payload);
        navigate(`/recipes/${id}`);
      } else {
        const res = await api.post('/recipes', payload);
        navigate(`/recipes/${res.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save recipe — try again.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: 56, paddingBottom: 80 }}>
      <div className="paper-card wide">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: 6 }}>
          {editMode ? 'Edit recipe' : 'Share a new recipe'}
        </h1>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24, fontSize: '0.92rem' }}>
          {editMode ? 'Update the details below.' : 'Fill in the card below — everyone will see this on the home feed.'}
        </p>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Recipe title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="ingredients">Ingredients (one per line)</label>
            <textarea id="ingredients" name="ingredients" rows={5} value={form.ingredients} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="steps">Steps (one per line)</label>
            <textarea id="steps" name="steps" rows={6} value={form.steps} onChange={handleChange} required />
          </div>
          <div className="field">
            <label htmlFor="cookTimeMinutes">Cook time (minutes)</label>
            <input id="cookTimeMinutes" name="cookTimeMinutes" type="number" value={form.cookTimeMinutes} onChange={handleChange} />
          </div>
          <div className="field">
            <label htmlFor="imageUrl">Image URL (optional)</label>
            <input id="imageUrl" name="imageUrl" placeholder="https://..." value={form.imageUrl} onChange={handleChange} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn btn-primary" type="submit">{editMode ? 'Save changes' : 'Publish recipe'}</button>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
