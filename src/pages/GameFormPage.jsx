// Importaciones necesarias de React, hooks y componentes personalizados
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from '../utils/usePrompt';
import GameForm from '../components/GameForm';
import GameCard from '../components/GameCard';
import { getItem, setItem, removeItem } from '../utils/db';

function GameFormPage() {
  // Estados para almacenar los datos del formulario
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [yearPlayed, setYearPlayed] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [origin, setOrigin] = useState('');
  const [genreList, setGenreList] = useState([]); // Lista de todos los géneros disponibles
  const [selectedGenres, setSelectedGenres] = useState([]); // Géneros seleccionados por el usuario
  const [yearOptions, setYearOptions] = useState([]); // Años posibles para mostrar en el dropdown
  const [genresWithColors, setGenresWithColors] = useState([]); // <-- Nuevo estado para géneros con colores

  // Refs para modo edición y para guardar el estado inicial del formulario
  const isEditingRef = useRef(false);
  const initialFormRef = useRef({});

  // Hook de navegación
  const navigate = useNavigate();

  // useEffect para cargar datos iniciales y detectar si estamos editando un juego
  useEffect(() => {
    async function loadFormData() {
      const data = (await getItem('gameTrackerData')) || { years: [], genres: [] };
      setGenreList((data.genres || []).slice().sort((a, b) => a.genre.localeCompare(b.genre)));
      setYearOptions(data.years || []);
      setGenresWithColors(data.genres || []); // <-- Guardamos también los colores

      const editData = await getItem('editGame');
      if (editData) {
        isEditingRef.current = true;
        setName(editData.name || '');
        setImageUrl(editData.image || '');
        setImagePreview(editData.image || '');
        setYearPlayed(editData.year || '');
        setOrigin(editData.origin || '');
        setCategory(editData.category || '');
        setSubcategory(editData.subcategory || '');
        setSelectedGenres(editData.genres || []);

        initialFormRef.current = {
          name: editData.name || '',
          image: editData.image || '',
          year: editData.year || '',
          origin: editData.origin || '',
          category: editData.category || '',
          subcategory: editData.subcategory || '',
          genres: editData.genres || [],
        };
      }

      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    loadFormData();
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      removeItem('editGame');
    };
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

  const handleSubmit = async () => {
    const stored = (await getItem('gameTrackerData')) || { games: [] };
    const parsed = stored.games || [];
    let updatedGames;

    if (isEditingRef.current) {
      const editing = initialFormRef.current;
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
      updatedGames = parsed.map((g) => (g.name === editing.name ? updatedGame : g));
    } else {
      const nameExists = parsed.some((g) => g.name.toLowerCase().trim() === name.toLowerCase().trim());
      if (nameExists) {
        alert('Ya existe un juego con ese nombre. Por favor, elige otro nombre.');
        return;
      }

      const newGame = {
        name,
        image: imageUrl,
        year: yearPlayed,
        origin,
        category,
        subcategory,
        genres: selectedGenres,
        tier: null,
        tierPosition: null,
      };
      updatedGames = [...parsed, newGame];
    }

    await setItem('gameTrackerData', { ...stored, games: updatedGames });

    initialFormRef.current = {
      name,
      image: imageUrl,
      year: yearPlayed,
      origin,
      category,
      subcategory,
      genres: selectedGenres,
    };

    await removeItem('editGame');
    navigate('/Games', { replace: true });
  };

  const handleCancel = async () => {
    if (hasUnsavedChanges()) {
      const confirmLeave = window.confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
      if (!confirmLeave) return;
    }
    await removeItem('editGame');
    navigate('/Games', { replace: true });
  };

  usePrompt('Tienes cambios sin guardar. ¿Seguro que quieres salir?', hasUnsavedChanges());

  return (
    <div className="form-page">
      <GameForm
        name={name}
        setName={setName}
        imageUrl={imageUrl}
        handleImageChange={handleImageChange}
        yearPlayed={yearPlayed}
        setYearPlayed={setYearPlayed}
        yearOptions={yearOptions}
        origin={origin}
        setOrigin={setOrigin}
        category={category}
        setCategory={setCategory}
        subcategory={subcategory}
        setSubcategory={setSubcategory}
        genreList={genreList}
        selectedGenres={selectedGenres}
        handleGenreToggle={handleGenreToggle}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        isEditing={isEditingRef.current}
      />

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
        genresWithColors={genresWithColors} // <-- ✅ pasamos el prop correctamente
      />
    </div>
  );
}

export default GameFormPage;
