import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/_boutonretour.scss';


const BoutonRetourQuiz = () => {
    return (
        <div>
            <div className="bouton">
                <Link to={'/quiz'} style={{ textDecoration: 'none', color: 'black' }}>
                    <h1>retour</h1>
                </Link>
            </div>
        </div>
    );
};

export default BoutonRetourQuiz;