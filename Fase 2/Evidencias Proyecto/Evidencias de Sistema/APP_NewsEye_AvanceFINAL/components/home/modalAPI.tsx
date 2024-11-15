import React from 'react';
import '@/app/globals.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{title}</h2>
        <hr />
        <p>{content}</p>
        <div className="modal-buttons">
          <button className="button-close" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
