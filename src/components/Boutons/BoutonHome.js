import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/_boutonretour.scss';


const BoutonHome = () => {
    return (
        <div>
            <div className="bouton">
                <Link to={'/'} style={{ textDecoration: 'none', color: 'black' }}>
                    <h1>retour accueil</h1>
                </Link>
            </div>
        </div>
    );
};

export default BoutonHome;