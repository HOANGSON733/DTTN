import React from 'react';
import './modal.css';

const CustomModal = ({ show, handleClose, children }) => {
    return (
        <div className={`modal ${show ? 'show' : ''}`} onClick={handleClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close" onClick={handleClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default CustomModal;
