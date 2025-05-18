import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaEdit, FaList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './MenuButton.css';

const MenuButton = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const goToPageName = (namePage) => {
    navigate(namePage);
    setIsOpen(false);
  };

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
          <button className="dropdown-item" onClick={() => goToPageName('/GameForm')}>
            <FaPlus/>
            Add new game
          </button>
          <button className="dropdown-item" onClick={() => goToPageName('/UpdateTierList')}>
            <FaList/>
            Update tier list
          </button>
          <hr/>
          <button className="dropdown-item" onClick={() => goToPageName('/UpdateData')}>
            <FaEdit/>
            Update data
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuButton;
