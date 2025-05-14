import React from 'react';
import GenreSelector from './GenreSelector';
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
  // Opciones disponibles
  const originOptions = ['Indie', 'Doble A', 'Triple A'];
  const categoryOptions = ['Singleplayer', 'Mixto', 'Multijugador'];
  const subcategoryOptions = {
    Singleplayer: [
      'One time story',
      'Replayable by gameplay',
      'Recurring by content',
    ],
    Mixto: ['Flexible', 'Cooperative'],
    Multijugador: ['PvP', 'PvE'],
  };

  return (
    <form onSubmit={handleSubmit} className="game-form">
      <h2>{isEditing ? 'Edit game' : 'Add new game'}</h2>

      {/* Game name input */}
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

      {/* Cover image file input */}
      <div className="single-group">
        <label>
          Cover image
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>
      
      {/* Year and Origin - Horizontal layout */}
      <div className="horizontal-group">
        <label>
          Year played
          <select value={yearPlayed} onChange={(e) => setYearPlayed(e.target.value)} required>
            {yearOptions.map((y, i) => (
              <option key={i} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label>
          Origin
          <select value={origin} onChange={(e) => setOrigin(e.target.value)} required>
            {originOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Category and Subcategory - Horizontal layout */}
      <div className="horizontal-group">
        <label>
          Main category
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            {categoryOptions.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subcategory
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required>
            {subcategoryOptions[category]?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            )) || <option value="">Select a category first</option>}
          </select>
        </label>
      </div>

      {/* Genre selector */}
      <GenreSelector
        genreList={genreList}
        selectedGenres={selectedGenres}
        onToggle={handleGenreToggle}
      />

      {/* Submit button */}
      <div className="form-buttons">
        <button type="submit">{isEditing ? 'Guardar Cambios' : 'Guardar Juego'}</button>
      </div>
    </form>
  );
}

export default GameForm;
