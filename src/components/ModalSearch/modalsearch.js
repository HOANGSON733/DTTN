import React from 'react';
import './modalsearch.css';

const CustomModal = ({ show, handleClose, children }) => {
    return (
        <div className={`modalsearch ${show ? 'showsearch' : ''}`} onClick={handleClose}>
            <div className="modal-content-search" onClick={e => e.stopPropagation()}>
                <span className="closesearch" onClick={handleClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export default CustomModal;
