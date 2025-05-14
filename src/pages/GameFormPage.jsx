import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from '../utils/usePrompt'; // Custom hook to block navigation when there are unsaved changes
import GameCard from '../components/GameCard';
import './GameFormPage.css';

function GameFormPage() {
  // State variables for form fields
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [yearPlayed, setYearPlayed] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [origin, setOrigin] = useState('');
  const [genreList, setGenreList] = useState([]); // List of available genres from localStorage
  const [selectedGenres, setSelectedGenres] = useState([]); // Genres selected in the form
  const [yearOptions, setYearOptions] = useState([]); // Available years

  const navigate = useNavigate();

  // Refs for values that should not trigger re-renders
  const isEditingRef = useRef(false); // True if editing an existing game
  const initialFormRef = useRef({}); // Stores the initial state of the form for comparison

  useEffect(() => {
    // Load available years and genres from localStorage
    const data = localStorage.getItem('gameUpdateData');
    if (data) {
      const parsed = JSON.parse(data);
      setGenreList(parsed.genres || []);
      setYearOptions(parsed.years || []);
    }

    // Load game data if in edit mode
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
      isEditingRef.current = true;

      // Store initial values for unsaved changes detection
      initialFormRef.current = {
        name: game.name || '',
        image: game.image || '',
        year: game.year || '',
        origin: game.origin || '',
        category: game.category || '',
        subcategory: game.subcategory || '',
        genres: game.genres || [],
      };
    }

    // Warn user before leaving the page if there are unsaved changes
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome to show the warning
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      localStorage.removeItem('editGame'); // Clear edit mode data
    };
  }, []);

  // Handle image file selection and preview
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

  // Toggle selected genres on checkbox click
  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Save form data on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const stored = localStorage.getItem('games');
    const parsed = stored ? JSON.parse(stored) : [];

    const editData = localStorage.getItem('editGame');
    let updatedGames;

    if (editData) {
      // Edit existing game
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
    } else {
      // Add new game
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
    localStorage.removeItem('editGame'); // Clear edit state
    navigate('/Games'); // Navigate back to the games list
  };

  // Cancel form and go back, showing a confirmation dialog if there are unsaved changes
  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      const confirmLeave = window.confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
      if (!confirmLeave) return;
    }
    localStorage.removeItem('editGame');
    navigate('/Games');
  };

  // Checks if current form values differ from initial ones
  const hasUnsavedChanges = () => {
    const initial = initialFormRef.current;
    return (
      name !== initial.name ||
      imageUrl !== initial.image ||
      yearPlayed !== initial.year ||
      origin !== initial.origin ||
      category !== initial.category ||
      subcategory !== initial.subcategory ||
      JSON.stringify(selectedGenres) !== JSON.stringify(initial.genres)
    );
  };

  // Activate navigation blocking if there are unsaved changes
  usePrompt('Tienes cambios sin guardar. ¿Seguro que quieres salir?', hasUnsavedChanges());

  return (
    <div className="form-page">
      <form onSubmit={handleSubmit} className="game-form">
        <h2>{isEditingRef.current ? 'Edit game' : 'Add new game'}</h2>

        <label>Name of the game</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isEditingRef.current}/>

        <label>Cover image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <label>Year played</label>
        <select value={yearPlayed} onChange={(e) => setYearPlayed(e.target.value)} required>
          {yearOptions.map((y, i) => (
            <option key={i} value={y}>{y}</option>
          ))}
        </select>

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

        {/* Subcategory dropdown appears conditionally based on selected category */}
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

        <div className="form-buttons">
          <button type="submit">{isEditingRef.current ? 'Guardar Cambios' : 'Guardar Juego'}</button>
          <button type="button" onClick={handleCancel}>Cancelar</button>
        </div>
      </form>

      {/* Game preview panel */}
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
            disableGameCardModal={true}
          />
        )}
      </div>
    </div>
  );
}

export default GameFormPage;
