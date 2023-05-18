import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/_seconnecter.scss';

const SeConnecter = () => {
    return (
        <div className="SeConnecter">
            <ul>
                <NavLink to="/login" className={(nav) => (nav.isActive ? "nav-active" : "")}>
                    <li>se connecter</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default SeConnecter;
