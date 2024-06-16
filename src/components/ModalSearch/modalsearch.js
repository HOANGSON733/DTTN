import React from 'react';
import './modalsearch.css';
import { IoMdClose } from "react-icons/io";
const CustomModal = ({ show, handleClose, children }) => {
    return (
        <div className={`modalsearch1 ${show ? 'showsearch1' : ''}`} onClick={handleClose}>
            <div className="modal-content-search" onClick={e => e.stopPropagation()}>
                <span className="closesearch" onClick={handleClose}><IoMdClose /></span>
                {children}
            </div>
        </div>
    );
};

export default CustomModal;
