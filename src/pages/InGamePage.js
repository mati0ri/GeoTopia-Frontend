import { dialogClasses } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import BoutonQuiz from '../components/Boutons/BoutonQuiz';
import Navigation from '../components/Navigation';
import '../styles/components/_ingamepage.scss';

const InGamePage = () => {

    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [bestScore, setBestScore] = useState(0);
    const [username, setUsername] = useState(null);
    const [questions, setQuestions] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [liveScore, setliveScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [recordBroken, setRecordBroken] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);


    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        //va chercher les infos du quiz, on y accede par quiz.category par exemple
        const fetchQuiz = async () => {
            const response = await fetch(`https://geotopia-api.onrender.com/api/quiz/${id}`, {
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
        //recupere les questions dans la BD
        const fetchQuestions = async () => {
            console.log('quiz:', quiz);
            if (quiz && quiz.category) {
                const difficulties = [1, 2, 3];
                const limits = [10, 20, 20]; //nb de question par difficulté
                let fetchedQuestions = [];

                for (let i = 0; i < difficulties.length; i++) {
                    const response = await fetch(`https://geotopia-api.onrender.com/api/question/category/${quiz.category.toLowerCase()}/difficulty/${difficulties[i]}?limit=${limits[i]}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    const data = await response.json();
                    data.forEach(question => {
                        // Mélanger les réponses ici
                        question.mixedAnswers = [question.answer, ...question.wrongAnswers].sort(() => Math.random() - 0.5);
                    });
                    fetchedQuestions = fetchedQuestions.concat(data);
                }


                setQuestions(fetchedQuestions); //la liste des questions desormais accessible dans la variables questions
            }
        };
        fetchQuestions();
    }, [quiz, accessToken]);

    const handleAnswerClick = (answer) => {
        const currentQuestion = questions[currentQuestionIndex];
        setSelectedAnswer(answer);
        if (answer === currentQuestion.answer) {
            setliveScore(liveScore + 1);
            setIsAnswerCorrect(true);
        } else {
            setIsAnswerCorrect(false);
        }
        // Attendez quelques secondes avant de passer à la question suivante pour que l'utilisateur puisse voir la bonne réponse
        setTimeout(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);  // Réinitialisez la réponse sélectionnée
            if (answer !== currentQuestion.answer) {
                setMistakes(mistakes + 1);
                setLives(lives - 1);
            }
        }, 1500);
    };


    useEffect(() => {
        const fetchBestScore = async () => {
            const response = await fetch(`https://geotopia-api.onrender.com/api/passage/quiz/${id}/pseudo/${username}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            if (data.score !== null && data.score !== undefined) {
                setBestScore(data.score);
            }
        };

        if (username) { // Ne faites la requête que si le username existe
            fetchBestScore();
            console.log("best score : ", bestScore);
        }
    }, [id, username]);




    useEffect(() => {
        // Appeler l'API /api/user/current pour récupérer les informations de l'utilisateur connecté
        fetch('https://geotopia-api.onrender.com/api/user/current', {
            headers: {
                Authorization: `Bearer ${accessToken}` // Ajouter l'accessToken dans le header d'autorisation
            }
        })
            .then(response => response.json())
            .then(data => {
                // Mettre à jour l'état avec l'username de l'utilisateur
                setUsername(data.username);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
            });
    }, []);

    console.log("bestscore: ", bestScore)


    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@ Début de l'affichage @@@@@@@@@@@@@@@@@@@@@@@@@@@@//
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//



    if (!quiz || !questions) {
        // chargement des questions 
        return (
            <div className='chargement'>
                <Navigation />
                <h1 style={{ marginTop: '6rem' }}>Chargement du quiz...</h1>
            </div>
        )
    }

    if (questions && questions.length === 0) {
        return (
            <div className='noQuestion'>
                <Navigation />
                <div className='oo' style={{ marginTop: '6rem' }}>


                    <h1 >Pas encore de question disponible pour ce Quiz ...</h1>
                    <NavLink to="/proposition">
                        <p>propose nous ta question !</p>
                    </NavLink>
                    <BoutonQuiz text="Quitter" />
                </div>
            </div>
        )

    }

    if (currentQuestionIndex >= questions.length || mistakes >= 3) {
        if (!gameOver) {
            setGameOver(true);
            if (Math.round((liveScore / questions.length) * 100) > bestScore) {
                console.log("1");
                fetch(`https://geotopia-api.onrender.com/api/passage/quiz/${id}/pseudo/${username}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ score: Math.round((liveScore / questions.length) * 100) })
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        setBestScore(data.score);
                        setRecordBroken(true);
                        console.log("2");

                    })
                    .catch(error => {
                        console.error('Erreur lors de la mise à jour du bestScore:', error);
                    });

            }
        } else {
            if (recordBroken) {
                return (
                    <div className='fin'>
                        <Navigation />
                        <h1>Fin du quiz !</h1>
                        <h2><span className='record'>nouveau record</span> {bestScore}<span className='pourcent'>%</span></h2>
                        <BoutonQuiz text="Choisir un nouveau Quiz" />
                    </div>
                );
            } else {
                return (
                    <div className='fin'>
                        <Navigation />
                        <h1>Fin du quiz !</h1>
                        <h2><span className='normal'>Tu as fait un score de </span>{Math.round((liveScore / questions.length) * 100)}<span className='pourcent'>%</span></h2>
                        <BoutonQuiz text="Choisir un nouveau Quiz" />
                    </div>
                );
            }
        }
    }


    // Si le jeu est terminé, ne pas afficher les détails de la question
    if (currentQuestionIndex >= questions.length || lives <= 0 || gameOver) {
        return null;
    }
    const currentQuestion = questions[currentQuestionIndex];
    const answers = currentQuestion.mixedAnswers;

    const color1 = 'rgb(124, 30, 148)';
    const color2 = 'rgba(124, 30, 148, 0.8)';


    return (

        <div className='question'>

            <div className='entete'><h1>Question {currentQuestionIndex + 1}</h1></div>

            <div className='choix'>

                <div className='pays'><h2>{currentQuestion.question}</h2></div>

                <img src={currentQuestion.image} alt="" />

                <div className='infos'>

                    <p>Score : {Math.round((liveScore / questions.length) * 100)}%</p>
                    <p>Niveau : {currentQuestion.difficulty}</p>

                    <div className='lives'>
                        {[...Array(lives)].map((e, i) => <span key={i} role="img" aria-label="heart">❤️</span>)}
                    </div>

                    <BoutonQuiz text="Quitter" />

                </div>

                <div className="answer-options">
                    {answers.map((answer) => (
                        <button
                            key={answer}
                            onClick={() => handleAnswerClick(answer)}
                            style={{
                                backgroundColor:
                                    selectedAnswer
                                        ? answer === currentQuestion.answer
                                            ? 'rgb(45, 192, 79)'  // La bonne réponse, une fois que l'utilisateur a fait son choix
                                            : selectedAnswer === answer
                                                ? 'rgb(216, 61, 61)'       // La réponse sélectionnée par l'utilisateur était incorrecte
                                                : 'rgb(134, 30, 148)'  // Les autres réponses non sélectionnées
                                        : 'rgb(124, 30, 148)'      // Avant que l'utilisateur n'ait fait son choix
                            }}
                        >
                            {answer}
                        </button>
                    ))}
                </div>


            </div>

        </div>
    );
};

export default InGamePage;
