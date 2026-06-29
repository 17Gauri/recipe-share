import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';

function RecipeForm({ editMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    ingredients: '',
    steps: '',
    cookTimeMinutes: ''
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editMode && id) {
      api.get(`/recipes/${id}`).then((res) =>
        setForm({
          title: res.data.title,
          ingredients: res.data.ingredients,
          steps: res.data.steps,
          cookTimeMinutes: res.data.cookTimeMinutes || ''
        })
      );
    }
  }, [editMode, id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData();

    formData.append('title', form.title);
    formData.append('ingredients', form.ingredients);
    formData.append('steps', form.steps);

    if (form.cookTimeMinutes) {
      formData.append(
        'cookTimeMinutes',
        form.cookTimeMinutes
      );
    }

    if (image) {
      formData.append('image', image);
    }

    try {
      if (editMode) {
        await api.put(`/recipes/${id}`, formData);
        navigate(`/recipes/${id}`);
      } else {
        const res = await api.post('/recipes', formData);
        navigate(`/recipes/${res.data.id}`);
      }
    } catch (err) {
      console.log('FULL ERROR:', err);
      console.log('RESPONSE:', err.response);
      console.log('DATA:', err.response?.data);
      console.log('STATUS:', err.response?.status);

      setError(
        err.response?.data?.message ||
        err.message ||
        'Could not save recipe — try again.'
      );
    }
  };

  return (
    <div
      className="container"
      style={{ paddingTop: 56, paddingBottom: 80 }}
    >
      <div className="paper-card wide">
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem',
            marginBottom: 6
          }}
        >
          {editMode ? 'Edit recipe' : 'Share a new recipe'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Recipe title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Ingredients (one per line)</label>
            <textarea
              name="ingredients"
              rows={5}
              value={form.ingredients}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Steps (one per line)</label>
            <textarea
              name="steps"
              rows={6}
              value={form.steps}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Cook time (minutes)</label>
            <input
              type="number"
              name="cookTimeMinutes"
              value={form.cookTimeMinutes}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Upload Recipe Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {error && (
            <p className="error-msg">{error}</p>
          )}

          <button
            className="btn btn-primary"
            type="submit"
          >
            {editMode
              ? 'Save Changes'
              : 'Publish Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;