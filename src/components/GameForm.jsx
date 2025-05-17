import React from 'react';
import GenreSelector from './GenreSelector';
import './GameCard';
import './GameForm.css';

function GameForm({
  name,
  setName,
  imageUrl,
  handleImageChange,
  yearPlayed,
  setYearPlayed,
  yearOptions,
  origin,
  setOrigin,
  category,
  setCategory,
  subcategory,
  setSubcategory,
  genreList,
  selectedGenres,
  handleGenreToggle,
  handleSubmit,
  isEditing,
}) {
  const originOptions = ['Indie', 'Doble A', 'Triple A'];
  const categoryOptions = ['Singleplayer', 'Mixto', 'Multijugador'];
  const subcategoryOptions = {
    Singleplayer: ['One time story', 'Replayable by gameplay', 'Recurring by content'],
    Mixto: ['Flexible', 'Cooperative'],
    Multijugador: ['PvP', 'PvE'],
  };

  const validateForm = (e) => {
    e.preventDefault();

    // Validar imagen
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];

    const isEditing = imageUrl && !file;

    if (!imageUrl && !file) {
      alert('Debes seleccionar una imagen de portada.');
      return;
    }

    if (selectedGenres.length === 0) {
      alert('You need to select at least a genere');
      return;
    }

    handleSubmit(e);
  };

  return (
    <form onSubmit={validateForm} className="game-form">
      <h2>{isEditing ? 'Edit game' : 'Add new game'}</h2>

      {/* Name */}
      <div className="single-group">
        <label>
          Name of the game
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isEditing}
          />
        </label>
      </div>

      {/* Image */}
      <div className="single-group">
        <label>
          Cover image
          <input type="file" accept="image/*" onChange={handleImageChange} required={!isEditing} />
        </label>
      </div>

      {/* Year & Origin */}
      <div className="horizontal-group">
        <label>
          Year played
          <select value={yearPlayed} onChange={(e) => setYearPlayed(e.target.value)} required>
            <option value="" disabled hidden></option>
            {yearOptions.map((y, i) => (
              <option key={i} value={y}>{y}</option>
            ))}
          </select>
        </label>

        <label>
          Origin
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} required>
            <option value="" disabled hidden></option>
            {originOptions.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Category & Subcategory */}
      <div className="horizontal-group">
        <label>
          Main category
          <select value={category} onChange={(e) => {setCategory(e.target.value); setSubcategory('');}} required>
            <option value="" disabled hidden></option>
            {categoryOptions.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <label>
          Subcategory
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required disabled={!category}>
            <option value="" disabled hidden></option>
            {subcategoryOptions[category]?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Genre */}
      <GenreSelector
        genreList={genreList}
        selectedGenres={selectedGenres}
        onToggle={handleGenreToggle}
      />

      {/* Submit */}
      <div className="form-buttons">
        <button type="submit">{isEditing ? 'Guardar Cambios' : 'Guardar Juego'}</button>
      </div>
    </form>
  );
}

export default GameForm;
