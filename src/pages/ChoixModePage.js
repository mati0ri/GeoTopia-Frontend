import React, { useState, useEffect } from 'react';
import ChoixMode from '../components/ChoixMode';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const ChoixModePage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true); // Ajout de l'état de chargement
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchQuizzes = async () => {
            const response = await fetch('https://geotopia-api.onrender.com/api/quiz', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            setQuizzes(data);
            setLoading(false); // Modification de l'état de chargement
        };
        fetchQuizzes();
    }, []);

    return (
        <div style={{ marginTop: '80px' }} className='page'>
            <Navigation />
            {loading ? ( // Affichage de l'écran de chargement si l'état de chargement est true
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <p>Chargement des quiz...</p>
                </div>
            ) : ( // Sinon, affichage des quiz
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {quizzes.map(quiz => (
                        <Link key={quiz._id} to={`/quiz/${quiz._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                            <ChoixMode style={{ marginRight: '20px' }} key={quiz._id} image={quiz.image} titre={quiz.category} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChoixModePage;

