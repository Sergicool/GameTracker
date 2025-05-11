import React, { useEffect, useRef, useState } from 'react';
import './GameCard.css';
import getGenreColor from '../utils/getGenreColor';

function GameCard({ game }) {

  // State to control whether the modal is open or closed
  const [showModal, setShowModal] = useState(false);
  // Open the modal
  const openModal = () => setShowModal(true);
  // Closes the modal when clicking outside
  const closeModal = (e) => {
    if (e.target.className === 'modal-overlay') setShowModal(false);
  };

  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(game.genres.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children);
    let initialTop = null;
    let count = 0;

    for (const child of children) {
      const top = child.getBoundingClientRect().top;
      if (initialTop === null) initialTop = top;

      // Detects if the label went to a new line
      if (top > initialTop) break;
      count++;
    }

    // If there are more hidden genres, reserve a space for the +N tag
    const adjustedCount = count < game.genres.length ? count - 1 : count;
    setVisibleCount(Math.max(0, adjustedCount));
  }, [game.genres]);

  const visibleGenres = game.genres.slice(0, visibleCount);
  const hiddenCount = game.genres.length - visibleCount;

  return (
    <>
      {/* Main card showing a preview of the game */}
      <div className="game-card" onClick={openModal}>
        <div className="card-head">
          <img src={game.image} alt={game.name} className="card-image" />
        </div>
        <div className="card-body">
          <h3 className="card-title">{game.name}</h3>
          <p className="card-year">{game.year}</p>

          <div className="card-genres" ref={containerRef}>
            {visibleGenres.map((genre, i) => (
              <span
                key={i}
                className="genre-tag"
                style={{ backgroundColor: getGenreColor(genre) }}
              >
                {genre}
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="genre-tag genre-tag-more">
                +{hiddenCount} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Modal that is displayed only when showModal is true */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            {/* Image and game details in the modal */}
            <img src={game.image} alt={game.name} className="modal-image" />
            <h2 className="modal-title">{game.name}</h2>
            <div className="modal-year">
              Played in 
              <div className="modal-year-value">{game.year}</div>
            </div>
            <p></p>
            <div className="modal-origin">
              Classification
              <div className="modal-origin-value">{game.origin}</div>
            </div>
            <p></p>
            <div className="modal-category">
              Category
              <div className="modal-category-value">{game.category} - {game.subcategory}</div>
            </div>
            <div className="modal-genres-wrapper">
              Genres
              <div className="modal-genres">
                {game.genres.map((genre, i) => (
                  <span 
                    className="modal-genre-tag"
                    key={i}
                    style={{ backgroundColor: getGenreColor(genre) }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>


            {/* Action buttons: edit and delete */}
            <div className="modal-buttons">
              <button className="edit-button">Editar</button>
              <button className="delete-button">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GameCard;
