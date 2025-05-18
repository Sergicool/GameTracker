import React from 'react';
import ModalBase from './ModalBase';
import './HelpModal.css';

function HelpModal({ isOpen, onClose, title, children }) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} extraClass="help-modal-content">
      <button className="modal-close" onClick={onClose}>&times;</button>
      <h2 className="modal-title">{title}</h2>
      <div className="modal-body">{children}</div>
    </ModalBase>
  );
}

export default HelpModal;
