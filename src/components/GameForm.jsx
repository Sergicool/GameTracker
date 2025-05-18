import React, { useState } from 'react';
import GenreSelector from './GenreSelector';
import './GameCard';
import './GameForm.css';
import HelpModal from './HelpModal';
import HelpIcon from './HelpIcon';

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

  const [activeHelp, setActiveHelp] = useState(null);

  const openHelp = (key) => setActiveHelp(key);
  const closeHelp = () => setActiveHelp(null);

  const originOptions = ['Indie', 'Doble A', 'Triple A'];
  const categoryOptions = ['Singleplayer', 'Mixed', 'Multijugador'];
  const subcategoryOptions = {
    Singleplayer: ['One time story', 'Replayable by gameplay', 'Recurring by content'],
    Mixed: ['Flexible', 'Cooperative'],
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
      <h2 className="game-form-title">{isEditing ? 'Edit game' : 'Add new game'}</h2>
      {/* Name */}
      <div className="single-group">
        <label className="game-form-label"> Name of the game </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isEditing}
          className={`game-input ${isEditing ? 'disabled' : ''}`}
        />
      </div>

      {/* Image */}
      <div className="single-group">
        <label className="game-form-label"> Cover image </label>
        <label htmlFor="fileUpload" className="custom-file-label">Subir imagen</label>
        <input id="fileUpload" type="file" accept="image/*" onChange={handleImageChange} required={!isEditing} />
      </div>

      {/* Year & Origin */}
      <div className="horizontal-group">
        <div>
          <label className="game-form-label">
            Year played
            <HelpIcon onClick={() => openHelp('year')} />
          </label>
          <select value={yearPlayed} onChange={(e) => setYearPlayed(e.target.value)} required>
            <option value="" disabled hidden></option>
            {yearOptions.map((y, i) => (
              <option key={i} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="game-form-label"> Origin </label>
            <select value={origin} onChange={(e) => setOrigin(e.target.value)} required>
              <option value="" disabled hidden></option>
              {originOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
        </div>      
      </div>

      {/* Category & Subcategory */}
      <div className="horizontal-group">
        <div>
          <label className="game-form-label"> 
            Main category 
            <HelpIcon onClick={() => openHelp('category')} />
          </label>
          <select value={category} onChange={(e) => {setCategory(e.target.value); setSubcategory('');}} required>
            <option value="" disabled hidden></option>
            {categoryOptions.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="game-form-label"> Subcategory </label>
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required disabled={!category}>
            <option value="" disabled hidden></option>
            {subcategoryOptions[category]?.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Genre */}
      <GenreSelector
        genreList={genreList}
        selectedGenres={selectedGenres}
        onToggle={handleGenreToggle}
      />

      {/* Submit */}
      <div className="form-buttons">
        <button type="submit">{isEditing ? 'Save Changes' : 'Save Game'}</button>
      </div>
      <HelpModal isOpen={activeHelp === 'year'} onClose={closeHelp} title="Setting a 'Year Played'">
        <p>
          It's uncommon for a game to start and end in different years, but ultimately it's a personal decision.
          Choose the year you *truly felt* you played the game: maybe the first full run, finishing the story,
          or the first time it truly hooked you. If you only tried it before but got into it later, use the latter.
        </p>
      </HelpModal>
      <HelpModal isOpen={activeHelp === 'category'} onClose={closeHelp} title="How to choose Category + Subcategory?">
        <p>
          Each game must have <strong>one unique category and subcategory</strong>. If a game has multiple modes (e.g. story, multiplayer),
          pick the one you actually played or want to rate.
        </p>
        <p>
          <strong>Example:</strong> <em>Call of Duty</em> has PvP, Campaign, and Co-op. To rate each separately:
        </p>
        <ul>
          <li><em>Call of Duty – PvP</em></li>
          <li><em>Call of Duty – Campaign</em></li>
          <li><em>Call of Duty – Zombies</em> (if relevant)</li>
        </ul>
        <p>
          This approach also can be applied to DLCs that feel like separate games or a totaly different experience.
        </p>
        <hr />
        <h4>Singleplayer</h4>
        <ul>
          <li><strong>One-time story</strong> (e.g. Outer Wilds): First time is best, avoid spoilers.</li>
          <li><strong>Gameplay replayable</strong> (e.g. Hollow Knight): Fun from challenge and mechanics.</li>
          <li><strong>Content-based replayable</strong> (e.g. Dead Cells): Designed to be played over and over.</li>
        </ul>
        <h4>Mixed (Single + Multi Player)</h4>
        <ul>
          <li><strong>Flexible</strong> (e.g. Terraria, Stardew Valley): Fun alone or with friends.</li>
          <li><strong>Cooperative dependent</strong> (e.g. Lethal Company): Not the same without friends.</li>
        </ul>
        <h4>Multiplayer</h4>
        <ul>
          <li><strong>PvP</strong> (e.g. Fortnite): Competitive core.</li>
          <li><strong>PvE</strong> (e.g. Warframe): Cooperative/mission-based experience.</li>
        </ul>
      </HelpModal>
    </form>

  );
}

export default GameForm;
