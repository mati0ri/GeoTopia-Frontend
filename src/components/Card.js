import React from 'react';

const Card = ({ country }) => {

    const imageStyle = {
        filter: 'saturate(1)'
    };

    return (
        <li className="card">
            <img
                src={country.flags.png}
                alt={"drapeau " + country.translations.fra.common}
                style={imageStyle} />
            <div className="infos">
                <h2>{country.translations.fra.common}</h2>
                <h4>{country.capital}</h4>
                <p>Pop. {country.population.toLocaleString()}</p>
            </div>
        </li>
    );
};

export default Card;