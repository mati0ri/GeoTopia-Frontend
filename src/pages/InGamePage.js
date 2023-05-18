import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BoutonQuiz from '../components/Boutons/BoutonQuiz';
import '../styles/components/_ingamepage.scss';

const InGamePage = () => {

    const { id } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [bestScore, setBestScore] = useState(0);
    const [username, setUsername] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [liveScore, setliveScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [recordBroken, setRecordBroken] = useState(false);

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        //va chercher les infos du quiz, on y accede par quiz.category par exemple
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
        //recupere les questions dans la BD
        const fetchQuestions = async () => {
            console.log('quiz:', quiz);
            if (quiz && quiz.category) {
                const difficulties = [1, 2, 3];
                const limits = [10, 20, 20]; //nb de question par difficulté
                let fetchedQuestions = [];

                for (let i = 0; i < difficulties.length; i++) {
                    const response = await fetch(`http://localhost:3001/api/question/category/${quiz.category.toLowerCase()}/difficulty/${difficulties[i]}?limit=${limits[i]}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    const data = await response.json();
                    fetchedQuestions = fetchedQuestions.concat(data);
                }
                setQuestions(fetchedQuestions); //la liste des questions desormais accessible dans la variables questions
            }
        };
        fetchQuestions();
    }, [quiz, accessToken]);

    const handleAnswerClick = (answer) => {
        const currentQuestion = questions[currentQuestionIndex];
        if (answer === currentQuestion.answer) {
            setliveScore(liveScore + 1);
        } else {
            setMistakes(mistakes + 1);
            setLives(lives - 1);
        }
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    useEffect(() => {
        const fetchBestScore = async () => {
            const response = await fetch(`http://localhost:3001/api/passage/quiz/${id}/pseudo/${username}`, {
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
        fetch('http://localhost:3001/api/user/current', {
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



    if (!quiz || questions.length === 0) {
        // chargement des questions 
        return <div>Chargement du quiz...</div>;
    }

    if (currentQuestionIndex >= questions.length || lives <= 0) {
        if (!gameOver) {
            setGameOver(true);
            if (Math.round((liveScore / questions.length) * 100) > bestScore) {
                console.log("1");
                fetch(`http://localhost:3001/api/passage/quiz/${id}/pseudo/${username}`, {
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
                    <div>
                        Fin du quiz ! Bien joué, tu as amélioré ton record : {bestScore}%
                        <BoutonQuiz text="Choisir un nouveau Quiz" />
                    </div>
                );
            } else {
                return (
                    <div>
                        Fin du quiz ! Score : {Math.round((liveScore / questions.length) * 100)}%
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
    const answers = [currentQuestion.answer, ...currentQuestion.wrongAnswers].sort(() => Math.random() - 0.5);

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
                        <button key={answer} onClick={() => handleAnswerClick(answer)}>
                            {answer}
                        </button>
                    ))}
                </div>

            </div>

        </div>
    );
};

export default InGamePage;
