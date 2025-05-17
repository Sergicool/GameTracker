// Importaciones necesarias de React, hooks y componentes personalizados
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from '../utils/usePrompt';
import GameForm from '../components/GameForm';
import GameCard from '../components/GameCard';

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

  // Refs para modo edición y para guardar el estado inicial del formulario
  const isEditingRef = useRef(false);
  const initialFormRef = useRef({});

  // Hook de navegación
  const navigate = useNavigate();

  // useEffect para cargar datos iniciales y detectar si estamos editando un juego
  useEffect(() => {
    // Cargar datos globales del juego desde localStorage (géneros y años)
    const data = localStorage.getItem('gameUpdateData');
    if (data) {
      const parsed = JSON.parse(data);
      setGenreList(parsed.genres || []);
      setYearOptions(parsed.years || []);
    }

    // Si existe 'editGame' en localStorage, estamos en modo edición
    const editData = localStorage.getItem('editGame');
    if (editData) {
      isEditingRef.current = true;
      
      const game = JSON.parse(editData);

      // Rellenamos el formulario con los datos del juego a editar
      setName(game.name || '');
      setImageUrl(game.image || '');
      setImagePreview(game.image || '');
      setYearPlayed(game.year || '');
      setOrigin(game.origin || '');
      setCategory(game.category || '');
      setSubcategory(game.subcategory || '');
      setSelectedGenres(game.genres || []);

      // Guardamos una copia del estado inicial del formulario para detectar cambios
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

    // Prevenir que el usuario cierre la página si hay cambios sin guardar
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Añadir y limpiar el evento de beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      localStorage.removeItem('editGame'); // Limpieza del localStorage
    };
  }, []);

  // Maneja la subida de imagen y la convierte en base64
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

  // Alterna la selección de géneros en el estado
  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Compara el formulario actual con el original para ver si hay cambios sin guardar
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

  // Maneja el envío del formulario, tanto para crear como editar juegos
  const handleSubmit = () => {
    // Obtener lista actual de juegos del localStorage
    const stored = localStorage.getItem('games');
    const parsed = stored ? JSON.parse(stored) : [];

    let updatedGames;

    if (isEditingRef.current) {
      // Si estamos editando, actualizamos el juego existente
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
      // Si estamos creando un nuevo juego comprobar que no existe ya uno con ese nombre
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
        isFavorite: false,
      };
      updatedGames = [...parsed, newGame];
    }

    // Guardamos la lista actualizada de juegos
    localStorage.setItem('games', JSON.stringify(updatedGames));

    // Actualizamos la referencia del formulario original para evitar falsos positivos de cambios
    initialFormRef.current = {
      name,
      image: imageUrl,
      year: yearPlayed,
      origin,
      category,
      subcategory,
      genres: selectedGenres,
    };

    // Limpiamos datos de edición y redirigimos a la lista de juegos
    localStorage.removeItem('editGame');
    navigate('/Games', { replace: true });
  };

  // Maneja la cancelación del formulario (volver atrás con confirmación si hay cambios)
  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      const confirmLeave = window.confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
      if (!confirmLeave) return;
    }
    localStorage.removeItem('editGame');
    navigate('/Games', { replace: true });
  };

  // Hook personalizado que bloquea navegación si hay cambios sin guardar
  usePrompt('Tienes cambios sin guardar. ¿Seguro que quieres salir?', hasUnsavedChanges());

  return (
    <div className="form-page">
      {/* Formulario del juego */}
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

      {/* Vista previa del juego mientras se edita */}
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
    </div>
  );
}

export default GameFormPage;
