import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/components/_boutonretour.scss';


const BoutonQuiz = ({text}) => {
    return (
        <div>
            <div className="bouton">
                <NavLink to={'/quiz'} style={{ textDecoration: 'none', color: 'black' }}>
                    <p>{text}</p>
                </NavLink>
            </div>
        </div>
    );
};

export default BoutonQuiz;
