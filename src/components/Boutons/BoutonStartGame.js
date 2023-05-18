import React from 'react';
import { Link } from 'react-router-dom';

const BoutonStartGame = () => {
    return (
        <div className='boutonstart'>
            <Link to={'/play'} style={{ textDecoration: 'none', color: 'black' }}>
                <h1>start game</h1>
            </Link>
        </div>
    );
};

export default BoutonStartGame;