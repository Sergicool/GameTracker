import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function GameFormPage() {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [yearPlayed, setYearPlayed] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [origin, setOrigin] = useState('');
  const [genreList, setGenreList] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('gameUpdateData');
    if (data) {
      const parsed = JSON.parse(data);
      setGenreList(parsed.genres || []);
      setYearOptions(parsed.years || []);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Base64
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGame = {
      id: Date.now(), // id único
      name,
      imageUrl,
      yearPlayed,
      origin,
      category,
      subcategory,
      genres: selectedGenres,
      // campos opcionales para futuro:
      tier: null,
      tierPosition: null,
      isFavorite: false,
    };

    const stored = localStorage.getItem('games');
    const parsed = stored ? JSON.parse(stored) : [];
    parsed.push(newGame);
    localStorage.setItem('games', JSON.stringify(parsed));
    navigate('/Games');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Registrar Nuevo Juego</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del juego"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px' }} />}

        <select value={yearPlayed} onChange={(e) => setYearPlayed(e.target.value)} required>
          <option value="">Seleccionar año</option>
          {yearOptions.map((y, i) => (
            <option key={i} value={y}>{y}</option>
          ))}
        </select>

        <select value={origin} onChange={(e) => setOrigin(e.target.value)} required>
          <option value="">Seleccionar origen</option>
          <option value="Indie">Indie</option>
          <option value="Doble A">Doble A</option>
          <option value="Triple A">Triple A</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Categoría principal</option>
          <option value="Singleplayer">Singleplayer</option>
          <option value="Mixto">Mixto</option>
          <option value="Multijugador">Multijugador</option>
        </select>

        {category && (
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required>
            <option value="">Subcategoría</option>
            {category === 'Singleplayer' && (
              <>
                <option value="One time story">One time story</option>
                <option value="Replayable by gameplay">Replayable by gameplay</option>
                <option value="Recurring by content">Recurring by content</option>
              </>
            )}
            {category === 'Mixto' && (
              <>
                <option value="Flexible">Flexible</option>
                <option value="Cooperative">Cooperative</option>
              </>
            )}
            {category === 'Multijugador' && (
              <>
                <option value="PvP">PvP</option>
                <option value="PvE">PvE</option>
              </>
            )}
          </select>
        )}

        <div>
          <h4>Géneros</h4>
          {genreList.map((g, i) => (
            <label key={i} style={{ marginRight: '1rem' }}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(g.genre)}
                onChange={() => handleGenreToggle(g.genre)}
              />{' '}
              {g.genre}
            </label>
          ))}
        </div>

        <button type="submit">Guardar Juego</button>
      </form>

      <section style={{ marginTop: '2rem', maxWidth: '800px' }}>
        <h3>Información sobre campos</h3>
        <p><strong>Año:</strong> El año en que jugaste realmente el juego.</p>
        <p><strong>Categoría/Subcategoría:</strong> Clasificación por modo de juego principal.</p>
        <p><strong>Origen:</strong> Tipo de desarrollo: Indie, Doble A o Triple A.</p>
        <p><strong>Géneros:</strong> Puedes seleccionar varios previamente definidos.</p>
      </section>
    </div>
  );
}

export default GameFormPage;
