import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import QuizComponent from '../components/QuizComponent';

const Quiz = () => {
    const imglondres = 'https://www.terre.tv/wp-content/uploads/2022/05/la-city-londres.jpg';
    const imgdrapeaux = 'https://media.istockphoto.com/id/135372772/fr/photo/une-photo-de-drapeaux-du-monde-entier.jpg?s=612x612&w=0&k=20&c=G4nl-zzkRU3SROp4crbzh2NarWgjWk2zBIRaKZLGmMM='
    const titres = ['Capitales', 'Capitales', 'Drapeaux', 'Drapeaux'];
    const modes = ['Survie', 'Niveaux', 'Survie', 'Niveaux'];
    const routes = ['/capitales-survie', '/capitales-niveaux', '/drapeaux-survie', '/drapeaux-niveaux'];

    return (
        <div className='page'>
            <Navigation />
            <div style={{ display: 'flex' }}>
                <Link to={routes[0]} style={{ textDecoration: 'none', color: 'black' }}>
                    <QuizComponent style={{ marginRight: '20px' }} key={1} image={imglondres} titre={titres[0]} mode={modes[0]} />
                </Link>
                <Link to={routes[1]} style={{ textDecoration: 'none', color: 'black' }}>
                    <QuizComponent key={2} image={imglondres} titre={titres[1]} mode={modes[1]} />
                </Link>
                
            </div>

            <div style={{ display: 'flex' }}>
                <Link to={routes[2]} style={{ textDecoration: 'none', color: 'black' }}>
                    <QuizComponent style={{ marginRight: '20px' }} key={3} image={imgdrapeaux} titre={titres[2]} mode={modes[2]} />
                </Link>
                <Link to={routes[3]} style={{ textDecoration: 'none', color: 'black' }}>
                    <QuizComponent key={4} image={imgdrapeaux} titre={titres[3]} mode={modes[3]} />
                </Link>
            </div>
        </div>
    );
};

export default Quiz;
