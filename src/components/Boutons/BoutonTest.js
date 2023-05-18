import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/components/_boutonretour.scss';


const BoutonTest = () => {
    return (
        <div>
            <div className="bouton">
                <NavLink to={'/home'} style={{ textDecoration: 'none', color: 'black' }}>
                    <p>retour accueil</p>
                </NavLink>
            </div>
        </div>
    );
};

export default BoutonTest;