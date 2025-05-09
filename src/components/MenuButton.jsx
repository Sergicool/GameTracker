import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './MenuButton.css';

const MenuButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const goToUpdateData = () => {
    navigate('/UpdateData');
    setIsOpen(false);
  };

  // Cierra el menú si se hace clic fuera del contenedor
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
      <button
        className={`menu-button ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        &#9776;
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={() => navigate('/GameForm')}>
            🆕 New game
          </button>
          <button className="dropdown-item" onClick={goToUpdateData}>
            🆙 Update data
          </button>
        </div>
      )}

    </div>
  );
};

export default MenuButton;
