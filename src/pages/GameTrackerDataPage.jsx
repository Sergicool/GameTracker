import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrashAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { usePrompt } from '../utils/usePrompt';
import './GameTrackerDataPage.css';

import { getItem, setItem } from '../utils/db.js';

function GameTrackerDataPage() {
  // Estados para inputs
  const [genre, setGenre] = useState('');
  const [color, setColor] = useState('#000000');
  const [year, setYear] = useState('');
  const [tierName, setTierName] = useState('');
  const [tierColor, setTierColor] = useState('#ff0000');
  const [tierPosition, setTierPosition] = useState(null);

  // Datos guardados
  const [genres, setGenres] = useState([]); // {genre, color}
  const [years, setYears] = useState([]);   // {year}
  const [tiers, setTiers] = useState([]);   // {name, color, position}
  const [games, setGames] = useState([]);   // games

  // Estado guardado para comparación cambios
  const [savedData, setSavedData] = useState({ genres: [], years: [], tiers: [] });

  // Estado modal carga backup
  const [backupFile, setBackupFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [backupSummary, setBackupSummary] = useState(null);

  // Al montar, cargar datos
  useEffect(() => {
    async function loadData() {
      try {
        const saved = await getItem('gameTrackerData');
        if (saved) {
          setGames(saved.games || []);
          setGenres((saved.genres || []).slice().sort((a, b) => a.genre.localeCompare(b.genre)));
          setYears(saved.years || []);
          setTiers(saved.tiers || []);
          setSavedData({
            genres: saved.genres || [],
            years: saved.years || [],
            tiers: saved.tiers || [],
            games: saved.games || [],
          });
        }
      } catch (error) {
        console.error('Error loading data from IndexedDB:', error);
      }
    }
    loadData();
  }, []);

  // Aviso antes de salir si hay cambios no guardados
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [genres, years, tiers, savedData]);

  // Detectar si hay cambios sin guardar
  const hasUnsavedChanges = () => {
    return (
      JSON.stringify(genres) !== JSON.stringify(savedData.genres) ||
      JSON.stringify(years) !== JSON.stringify(savedData.years) ||
      JSON.stringify(tiers) !== JSON.stringify(savedData.tiers)
    );
  };

  usePrompt("You have unsaved changes. Are you sure you want to leave?", hasUnsavedChanges());
  
  // --- Helpers para controlar si item está asignado a algún juego ---
  const isGenreAssigned = (genre) => games.some(g => g.genres?.includes(genre));
  const isYearAssigned = (year) => games.some(g => String(g.year) === String(year));
  const isTierAssigned = (tierName) => games.some(g => g.tier === tierName);

  // --- Funciones para añadir ---
  const handleAddGenre = () => {
    const genreTrimmed = genre.trim();
    if (!genreTrimmed) {
      alert('The name of the genre can\'t be empty.');
      return;
    }

    const existingIndex = genres.findIndex(g => g.genre.toLowerCase() === genreTrimmed.toLowerCase());

    if (existingIndex !== -1) {
      // Actualizar el color del género existente
      const updatedGenres = [...genres];
      updatedGenres[existingIndex].color = color;
      setGenres(updatedGenres);
    } else {
      // Agregar nuevo género
      setGenres([...genres, { genre: genreTrimmed, color }]);
    }

    setGenre('');
    setColor('#000000');
  };

  const handleAddYear = () => {
    const parsedYear = parseInt(year);
    if (!year || isNaN(parsedYear)) {
      alert('Add a valid year.');
      return;
    }
    if (years.includes(parsedYear)) {
      alert('This year already is registered.');
      return;
    }
    const updatedYears = [...years, parsedYear].sort((a, b) => a - b);
    setYears(updatedYears);
    setYear('');
  };

  // --- Funciones tiers ---

  // Orden tiers por posición ascendente
  const sortedTiers = [...tiers].sort((a, b) => a.position - b.position);

  const getNextTierPosition = () => {
    if (tiers.length === 0) return 1;
    return Math.max(...tiers.map(t => t.position)) + 1;
  };

  // Añadir tier, por defecto al final (si no especifica posición)
  const handleAddTier = () => {
    const nameTrimmed = tierName.trim();
    if (!nameTrimmed) {
      alert('The name of the tier can\'t be empty.');
      return;
    }

    const existingIndex = tiers.findIndex(t => t.name.toLowerCase() === nameTrimmed.toLowerCase());

    if (existingIndex !== -1) {
      // Actualizar el color del tier existente
      const updatedTiers = [...tiers];
      updatedTiers[existingIndex].color = tierColor;
      setTiers(updatedTiers);
    } else {
      let position = tierPosition;
      if (!position || position < 1 || position > tiers.length + 1) {
        position = getNextTierPosition();
      }

      // Para insertar en medio, desplazamos posiciones
      const updatedTiers = tiers.map(t => {
        if (t.position >= position) {
          return { ...t, position: t.position + 1 };
        }
        return t;
      });

      setTiers([...updatedTiers, { name: nameTrimmed, color: tierColor, position }]);
    }

    setTierName('');
    setTierColor('#ff0000');
    setTierPosition(null);
  };


  // --- Funciones para eliminar (con control) ---

  const handleRemoveGenre = (index) => {
    const genreToRemove = genres[index].genre;
    if (isGenreAssigned(genreToRemove)) {
      alert('You can\'t remove a genre assigned to a game, make sure to remove that genre from all games to do this.');
      return;
    }
    setGenres(genres.filter((_, i) => i !== index));
  };

  const handleRemoveYear = (index) => {
    const yearToRemove = years[index];
    if (isYearAssigned(yearToRemove)) {
      alert('You can\'t remove a year assigned to a game, make sure to remove that year from all games to do this.');
      return;
    }
    setYears(years.filter((_, i) => i !== index));
  };

  const handleRemoveTier = (index) => {
    const tierToRemove = sortedTiers[index].name;
    if (isTierAssigned(tierToRemove)) {
      alert('You can\'t delete a tier with games assigned to it, make sure you unassign all games from the tier to do this.');
      return;
    }
    const positionToRemove = sortedTiers[index].position;
    // Reordenar posiciones tras eliminar
    const filteredTiers = sortedTiers.filter((_, i) => i !== index)
      .map(t => (t.position > positionToRemove ? { ...t, position: t.position - 1 } : t));
    setTiers(filteredTiers);
  };

  // --- Funciones para mover tiers (subir/bajar posición) ---

  const moveTier = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sortedTiers.length) return;

    let newTiers = [...sortedTiers];
    // Swap positions
    const tempPos = newTiers[index].position;
    newTiers[index].position = newTiers[newIndex].position;
    newTiers[newIndex].position = tempPos;

    // Reordenar lista por posición
    newTiers.sort((a, b) => a.position - b.position);
    setTiers(newTiers);
  };

  // --- Guardar todos los datos ---

  const handleSaveChanges = async () => {
    try {
      await setItem('gameTrackerData', { genres, years, tiers, games });
      setSavedData({ genres, years, tiers, games });
      alert('Changes saved!');
    } catch (error) {
      alert('Error saving changes');
      console.error('Error saving data:', error);
    }
  };


  // --- Backup completo ---

  const handleDownloadBackup = () => {
    const data = { genres, years, tiers, games };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gameTrackerData.json';
    a.click();
  };

  // --- Cargar backup: lectura archivo y abrir modal ---
  const handleFileChange = (e) => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.genres || !parsed.years || !parsed.tiers) {
          alert('The file does not have the correct structure.');
          return;
        }
        setBackupFile(parsed);
        setBackupSummary({
          games: parsed.games ? parsed.games.length : 0,
          genres: parsed.genres.length,
          years: parsed.years.length,
          tiers: parsed.tiers.length,
        });
        setShowModal(true);
      } catch {
        alert('The file could not be read. Make sure it\'s a valid JSON file.');
      }
    };

    reader.readAsText(file);
    e.target.value = ''; // reset input para poder subir el mismo archivo otra vez si se desea
  };

  // --- Confirmar carga de backup ---
  const confirmLoadBackup = async () => {
    if (!backupFile) return;

    setGenres(backupFile.genres);
    setYears(backupFile.years);
    setTiers(backupFile.tiers);
    setGames(backupFile.games || []);

    try {
      await setItem('gameTrackerData', {
        genres: backupFile.genres,
        years: backupFile.years,
        tiers: backupFile.tiers,
        games: backupFile.games || []
      });
      setSavedData({
        genres: backupFile.genres,
        years: backupFile.years,
        tiers: backupFile.tiers,
        games: backupFile.games || []
      });

      setShowModal(false);
      alert('Backup cargado correctamente. Ten en cuenta que la base de datos se ha reemplazado.');
    } catch (error) {
      alert('Error saving backup data.');
      console.error('Error saving backup:', error);
    }
  };


  // --- Cancelar carga de backup ---
  const cancelLoadBackup = () => {
    setBackupFile(null);
    setBackupSummary(null);
    setShowModal(false);
  };

  // Render
  return (
    <div className="update-data-page">
      <h1 className='update-data-page-title'>Game Tracker Data</h1>
      <div className="data-columns">

        {/* Géneros */}
        <section className="data-section">
          <h2 className='data-section-title'>Genres</h2>
          <div className="input-row">
            <input
              type="text"
              placeholder="Ej: RPG"
              value={genre}
              onChange={e => setGenre(e.target.value)}
            />
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              title="Color"
            />
            <button onClick={handleAddGenre} title="Agregar género">
              <FaPlus />
            </button>
          </div>

          <ul className="item-list">
            {genres.map((g, i) => (
              <li key={i} style={{ color: g.color }}>
                {g.genre}
                <button
                  className="btn-remove"
                  title={isGenreAssigned(g.genre) ? 'No se puede eliminar (asignado)' : 'Eliminar'}
                  disabled={isGenreAssigned(g.genre)}
                  onClick={() => handleRemoveGenre(i)}
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Años */}
        <section className="data-section">
          <h2 className='data-section-title'>Year</h2>
          <div className="input-row">
            <input
              type="number"
              placeholder="Ej: 2023"
              value={year}
              onChange={e => setYear(e.target.value)}
            />
            <button onClick={handleAddYear} title="Agregar año">
              <FaPlus />
            </button>
          </div>

          <ul className="item-list">
            {years.map((y, i) => (
              <li key={i}>
                {y}
                <button
                  className="btn-remove"
                  title={isYearAssigned(y) ? 'No se puede eliminar (asignado)' : 'Eliminar'}
                  disabled={isYearAssigned(y)}
                  onClick={() => handleRemoveYear(i)}
                >
                  <FaTrashAlt />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Tiers */}
        <section className="data-section">
          <h2 className='data-section-title'>Tiers</h2>
          <div className="input-row tier-input-row">
            <input
              type="text"
              placeholder="Ej: A"
              value={tierName}
              onChange={e => setTierName(e.target.value)}
            />
            <input
              type="color"
              value={tierColor}
              onChange={e => setTierColor(e.target.value)}
              title="Color"
            />
            <input
              type="number"
              placeholder={`Posición (1-${tiers.length + 1})`}
              value={tierPosition || ''}
              min="1"
              max={tiers.length + 1}
              onChange={e => setTierPosition(e.target.value ? parseInt(e.target.value) : null)}
              title="Posición del tier en la lista"
            />
            <button onClick={handleAddTier} title="Agregar tier">
              <FaPlus />
            </button>
          </div>

          <ul className="item-list">
            {sortedTiers.map((t, i) => (
              <li key={t.position} style={{ color: t.color }}>
                {t.name}
                <div className="tier-actions">
                  <button
                    title="Subir posición"
                    disabled={i === 0}
                    onClick={() => moveTier(i, -1)}
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    title="Bajar posición"
                    disabled={i === sortedTiers.length - 1}
                    onClick={() => moveTier(i, 1)}
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    className="btn-remove"
                    title={isTierAssigned(t.name) ? 'No se puede eliminar (asignado)' : 'Eliminar'}
                    disabled={isTierAssigned(t.name)}
                    onClick={() => handleRemoveTier(i)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="action-buttons">
        <button onClick={handleSaveChanges} disabled={!hasUnsavedChanges()}>
          Save changes
        </button>

        <button onClick={handleDownloadBackup}>Download backup</button>

        <label htmlFor="upload-backup" className="upload-label">
          Load backup
          <input
            type="file"
            id="upload-backup"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {/* Modal confirmación carga backup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm backup upload</h3>
            <p>The backup contains:</p>
            <ul>
              <li>Games: {backupSummary.games}</li>
              <li>Genres: {backupSummary.genres}</li>
              <li>Years: {backupSummary.years}</li>
              <li>Tiers: {backupSummary.tiers}</li>
            </ul>
            <p>
              Uploading the backup will completely replace the current database. Do you want to continue?
            </p>
            <div className="modal-buttons">
              <button onClick={confirmLoadBackup}>Confirm</button>
              <button onClick={cancelLoadBackup}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameTrackerDataPage;
