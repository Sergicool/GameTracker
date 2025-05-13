import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameCard from '../components/GameCard';
import './GameFormPage.css';

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

    const editData = localStorage.getItem('editGame');
    if (editData) {
      const game = JSON.parse(editData);
      setName(game.name || '');
      setImageUrl(game.image || '');
      setImagePreview(game.image || '');
      setYearPlayed(game.year || '');
      setOrigin(game.origin || '');
      setCategory(game.category || '');
      setSubcategory(game.subcategory || '');
      setSelectedGenres(game.genres || []);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const stored = localStorage.getItem('games');
    const parsed = stored ? JSON.parse(stored) : [];

    const editData = localStorage.getItem('editGame');
    let updatedGames;

    if (editData) {
      const editing = JSON.parse(editData);
      const updatedGame = {
        ...editing,
        name,
        image: imageUrl,
        year: yearPlayed,
        origin,
        category,
        subcategory,
        genres: selectedGenres,
      };
      updatedGames = parsed.map((g) => (g.id === editing.id ? updatedGame : g));
      localStorage.removeItem('editGame');
    } else {
      const newGame = {
        id: Date.now(),
        name,
        image: imageUrl,
        year: yearPlayed,
        origin,
        category,
        subcategory,
        genres: selectedGenres,
        tier: null,
        tierPosition: null,
        isFavorite: false,
      };
      updatedGames = [...parsed, newGame];
    }

    localStorage.setItem('games', JSON.stringify(updatedGames));
    navigate('/Games');
  };

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="game-form">
        <h2>Registrar Nuevo Juego</h2>

        <label>
          Nombre del juego
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        <label>
          Imagen
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        <label>
          Año jugado
          <select value={yearPlayed} onChange={(e) => setYearPlayed(e.target.value)} required>
            <option value="">Seleccionar año</option>
            {yearOptions.map((y, i) => (
              <option key={i} value={y}>{y}</option>
            ))}
          </select>
        </label>

        <label>
          Origen
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} required>
            <option value="">Seleccionar origen</option>
            <option value="Indie">Indie</option>
            <option value="Doble A">Doble A</option>
            <option value="Triple A">Triple A</option>
          </select>
        </label>

        <label>
          Categoría principal
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Categoría principal</option>
            <option value="Singleplayer">Singleplayer</option>
            <option value="Mixto">Mixto</option>
            <option value="Multijugador">Multijugador</option>
          </select>
        </label>

        {category && (
          <label>
            Subcategoría
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
          </label>
        )}

        <div className="genre-box">
          <h4>Géneros</h4>
          <div className="genre-list">
            {genreList.map((g, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(g.genre)}
                  onChange={() => handleGenreToggle(g.genre)}
                /> {g.genre}
              </label>
            ))}
          </div>
        </div>

        <button type="submit">Guardar Juego</button>
      </form>

      <div className="preview">
        <h3>Vista previa</h3>
        {name && (
          <GameCard
            game={{
              name,
              image: imagePreview,
              year: yearPlayed,
              genres: selectedGenres,
              category,
              subcategory,
              origin,
            }}
            disableGameCardModal = {true}
          />
        )}
      </div>
    </div>
  );
}

export default GameFormPage;