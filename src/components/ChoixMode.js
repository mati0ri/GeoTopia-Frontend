import React from 'react';
import '../styles/components/_quiz.scss';


const ChoixMode = ({ titre, image, mode }) => {
    return (
        <div>
            <li className="quiz">
                <h1>{titre}</h1>
                <img src={image} alt="im quiz" />
                <div className="info">
                    <h2>{mode}</h2>
                </div>
            </li>
        </div>
    );
};

export default ChoixMode;