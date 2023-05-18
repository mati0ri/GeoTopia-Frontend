import React from 'react';
import '../styles/components/_quiz.scss';

const Quiz = ({ image, titre, mode }) => {
    return (
        <div>
            <li className="quiz">
                <h1>{titre}</h1>
                <img src={image} alt="image du quiz" />
                <div className="info">
                    <h2>{mode}</h2>
                </div>
            </li>
        </div>
    );
};

export default Quiz;