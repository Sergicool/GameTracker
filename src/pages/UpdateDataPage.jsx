import React, { useState, useEffect, useRef } from 'react';

function UpdateDataPage() {
  const [genre, setGenre] = useState('');
  const [color, setColor] = useState('#000000');
  const [year, setYear] = useState('');

  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);
  const [savedData, setSavedData] = useState({ genres: [], years: [] });
  const isMounted = useRef(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('gameUpdateData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setGenres(parsed.genres || []);
      setYears(parsed.years || []);
      setSavedData({ genres: parsed.genres || [], years: parsed.years || [] });
    }
  }, []);

  // Avisar si se intenta salir sin guardar
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = ''; // Requerido para mostrar el aviso en algunos navegadores
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [genres, years, savedData]);

  // Detectar cambios sin guardar
  const hasUnsavedChanges = () => {
    return (
      JSON.stringify(genres) !== JSON.stringify(savedData.genres) ||
      JSON.stringify(years) !== JSON.stringify(savedData.years)
    );
  };

  const handleSaveChanges = () => {
    localStorage.setItem('gameUpdateData', JSON.stringify({ genres, years }));
    setSavedData({ genres, years });
    alert('¡Cambios guardados!');
  };

  const handleAddGenre = () => {
    if (!genre || genres.some(g => g.genre.toLowerCase() === genre.toLowerCase())) return;
    setGenres([...genres, { genre, color }]);
    setGenre('');
    setColor('#000000');
  };

  const handleAddYear = () => {
    const parsedYear = parseInt(year);
    if (!year || isNaN(parsedYear) || years.includes(parsedYear)) return;
    const updatedYears = [...years, parsedYear].sort((a, b) => a - b);
    setYears(updatedYears);
    setYear('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Agregar Género</h2>
      <input
        type="text"
        placeholder="Ej: RPG"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        title="Color"
      />
      <button onClick={handleAddGenre}>Agregar género</button>

      <ul style={{ marginTop: '1rem' }}>
        {genres.map((g, i) => (
          <li key={i} style={{ color: g.color }}>
            {g.genre}
            <button
              style={{ marginLeft: '1rem' }}
              onClick={() => setGenres(genres.filter((_, idx) => idx !== i))}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <h2>Agregar Año</h2>
      <input
        type="number"
        placeholder="Ej: 2023"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button onClick={handleAddYear}>Agregar año</button>

      <ul style={{ marginTop: '1rem' }}>
        {years.map((y, i) => (
          <li key={i}>
            {y}
            <button
              style={{ marginLeft: '1rem' }}
              onClick={() => setYears(years.filter((_, idx) => idx !== i))}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={handleSaveChanges} disabled={!hasUnsavedChanges()}>
          Registrar cambios
        </button>
        <button
          style={{ marginLeft: '1rem' }}
          onClick={() => {
            const blob = new Blob([JSON.stringify({ genres, years }, null, 2)], {
              type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'gameUpdateDataBackup.json';
            a.click();
          }}
        >
          Descargar Backup
        </button>
      </div>
    </div>
  );
}

export default UpdateDataPage;
