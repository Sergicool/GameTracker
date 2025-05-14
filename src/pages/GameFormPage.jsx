import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrompt } from '../utils/usePrompt';
import GameForm from '../components/GameForm';
import GamePreview from '../components/GamePreview';

function GameFormPage() {
  // State and refs
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

  const isEditingRef = useRef(false);
  const initialFormRef = useRef({});
  const navigate = useNavigate();

  // Load initial data
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
      isEditingRef.current = true;

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

    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      localStorage.removeItem('editGame');
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
    localStorage.removeItem('editGame');
    navigate('/Games');
  };

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      const confirmLeave = window.confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
      if (!confirmLeave) return;
    }
    localStorage.removeItem('editGame');
    navigate('/Games');
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

      <GamePreview
        name={name}
        imagePreview={imagePreview}
        yearPlayed={yearPlayed}
        selectedGenres={selectedGenres}
        category={category}
        subcategory={subcategory}
        origin={origin}
      />
    </div>
  );
}

export default GameFormPage;
