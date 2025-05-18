import React, { useEffect } from 'react';
import './ModalBase.css';

function ModalBase({ isOpen, onClose, children, extraClass = null }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className={`modal-content ${extraClass || ''}`}>
        {children}
      </div>
    </div>
  );
}

export default ModalBase;
