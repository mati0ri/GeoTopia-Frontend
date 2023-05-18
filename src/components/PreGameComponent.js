import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from './Navigation';
import '../styles/components/_pregame.scss';
import BoutonQuiz from './Boutons/BoutonQuiz';


const PreGameComponent = () => {
    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [scores, setScores] = useState(null);
    const [bestScore, setBestScore] = useState(null);
    const [username, setUsername] = useState(null);

    const [questions, setQuestions] = useState([]);
    const accessToken = localStorage.getItem('accessToken');



    useEffect(() => {
        const fetchQuiz = async () => {
            const response = await fetch(`http://localhost:3001/api/quiz/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            setQuiz(data);
        };
        fetchQuiz();
    }, [id]);

    useEffect(() => {
        const fetchScores = async () => {
            const response = await fetch(`http://localhost:3001/api/passage/quiz/${id}?limit=5`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            let data = await response.json();

            // Fetch titles for each user
            for (let score of data) {
                const response = await fetch(`http://localhost:3001/api/user/title/${score.pseudo}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const { titre } = await response.json();
                score.titre = titre;  // Add the title property to the score object
            }
            setScores(data);
            console.log(data);
        };
        fetchScores();
    }, [id, accessToken]);


    const startQuiz = async () => {
        const response = await fetch(`http://localhost:3001/api/question?category=${quiz.category}&limit=3`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        setQuestions(data);
    };

    useEffect(() => {
        // Appeler l'API /api/user/current pour récupérer les informations de l'utilisateur connecté
        const fetchUsername = async () => {
            const response = await fetch('http://localhost:3001/api/user/current', {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Ajouter l'accessToken dans le header d'autorisation
                }
            });
            const data = await response.json();
            setUsername(data.username);
        }
        fetchUsername();
    }, [accessToken]);

    useEffect(() => {
        const fetchBestScore = async () => {
            if (username) {
                const response = await fetch(`http://localhost:3001/api/passage/quiz/${id}/pseudo/${username}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                setBestScore(data.score);
            }
        };
        fetchBestScore();
    }, [id, username, accessToken]);





    if (!quiz) {
        return <div><h1>Chargement des informations...</h1><BoutonQuiz /></div>
    };

    return (
        <div className='pregamepage'>

            <Navigation />

            <li className='infos'>

                <h1>Quiz {quiz.category}</h1>
                <h2>{quiz.description}</h2>

                <div className='scores'>

                    <h3>Classement : </h3>
                    {!scores && <p>Chargement des scores...</p>}
                    {scores && scores.map((score, index) => (
                        <div key={index}>
                            <p className={
                                index === 0 ? "gold-text"
                                    : index === 1 ? "silver-text"
                                        : index === 2 ? "bronze-text"
                                            : ""}
                            >
                                {index === 0 ? <span role="img" aria-label="gold-medal">🥇</span>
                                    : index === 1 ? <span role="img" aria-label="silver-medal">🥈</span>
                                        : index === 2 ? <span role="img" aria-label="bronze-medal">🥉</span>
                                            : <span role="img" aria-label="bronze-medal">🎯</span>}
                                | {score.pseudo} {score.titre}: {score.score}%
                            </p>
                        </div>
                    ))}

                    <h4>Ton meilleur score : {bestScore ? `${bestScore}%` : "Tu n'as jamais tenté ce quiz"}</h4>

                </div>

                <h5>3 vies, 50 questions, va le plus loin possible !</h5>


                <Link to={`/ingame/${id}`} onClick={startQuiz} className='lien'>▶  C'est parti !</Link>
                <BoutonQuiz text="Retour" />

            </li>

        </div>
    );

};

export default PreGameComponent;
