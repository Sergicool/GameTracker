import React, { useState, useEffect } from 'react';

function SettingsPage() {

  // Campos del formulario
  const [genre, setGenre] = useState('');
  const [color, setColor] = useState('#000000');
  const [year, setYear] = useState('');

  // Datos guardados
  const [genres, setGenres] = useState([]);
  const [years, setYears] = useState([]);

  // Cargar desde localStorage
  useEffect(() => {
    // Obtener informacion guardada
    const saved = localStorage.getItem('gameSettings');
    // Si hay informacion guardada la pasamos a objetos
    if (saved) {
      const parsed = JSON.parse(saved);
      setGenres(parsed.genres || []);
      setYears(parsed.years || []);
    }
  }, []);

  // Guardar en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify({ genres, years }));
  }, [genres, years]);

  const handleAddGenre = () => {
    if (!genre) return;
    setGenres([...genres, { genre, color }]);
    setGenre('');
    setColor('#000000');
  };

  const handleAddYear = () => {
    if (!year) return;
    setYears([...years, parseInt(year)]);
    setYear('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Add genere</h2>
      <input
        type="text"
        placeholder="Genere (ex. RPG)"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        title="Color"
      />
      <button onClick={handleAddGenre}>Add genere</button>

      <ul style={{ marginTop: '1rem' }}>
        {genres.map((g, i) => (
          <li key={i} style={{ color: g.color }}>
            {g.genre}
            <button
              style={{ marginLeft: '1rem' }}
              onClick={() => {
                const updated = genres.filter((_, idx) => idx !== i);
                setGenres(updated);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h2>Add Year</h2>
      <input
        type="number"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button onClick={handleAddYear}>Add Year</button>

      <ul style={{ marginTop: '1rem' }}>
        {years.map((y, i) => (
          <li key={i}>
            {y}
            <button
              style={{ marginLeft: '1rem' }}
              onClick={() => {
                const updated = years.filter((_, idx) => idx !== i);
                setYears(updated);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          const blob = new Blob([JSON.stringify({ genres, years }, null, 2)], {
            type: 'application/json',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'gameSettingsBackup.json';
          a.click();
        }}
      >
        Download Backup
      </button>
    </div>
  );
}

export default SettingsPage;
