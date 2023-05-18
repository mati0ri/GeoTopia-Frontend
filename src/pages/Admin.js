import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import '../styles/components/_admin.scss';

const Admin = () => {
    const [questions, setQuestions] = useState([]);
    const [quizCategories, setQuizCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [validatedQuestions, setValidatedQuestions] = useState({});
    const [deletedQuestions, setDeletedQuestions] = useState({});
    const [questionStatuses, setQuestionStatuses] = useState({});



    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/proposition', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                // ensure every question has necessary fields even if they are empty
                const preparedData = data.map((item) => ({
                    _id: item._id,
                    question: item.question || "",
                    answer: item.answer || "",
                    image: item.image || "",
                    wrongAnswers: item.wrongAnswers || [],
                    category: item.category || "",
                    difficulty: item.difficulty || "",
                }));
                setQuestions(preparedData);
                console.log(questions);
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        const fetchQuizCategories = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/quiz', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();
                setQuizCategories(data.map(item => item.category));
            } catch (error) {
                console.error('Erreur:', error);
            }
        };

        fetchQuestions();
        fetchQuizCategories();
    }, []);

    const handleInputChange = (index, event) => {
        const values = [...questions];
        values[index][event.target.name] = event.target.value;
        setQuestions(values);
    };

    const handleArrayChange = (index, arrayIndex, event) => {
        const values = [...questions];
        values[index].wrongAnswers[arrayIndex] = event.target.value;
        setQuestions(values);
    };

    const handleSubmit = async (index) => {
        const question = questions[index];
        setQuestionStatuses(prevStatuses => ({ ...prevStatuses, [question._id]: 'submitting' }));
        try {
            const response = await fetch('http://localhost:3001/api/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(question)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setQuestionStatuses(prevStatuses => ({ ...prevStatuses, [question._id]: 'submitted' }));

            const deleteResponse = await fetch(`http://localhost:3001/api/proposition/${question._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (deleteResponse.ok) {
                setValidatedQuestions(prevState => ({ ...prevState, [question._id]: true }));
            }
        } catch (error) {
            setQuestionStatuses(prevStatuses => ({ ...prevStatuses, [question._id]: 'error' }));
            setErrorMessage("Erreur lors de la soumission de la question.");
        }
    };

    const handleDelete = async (index) => {
        const question = questions[index];
        setQuestionStatuses(prevStatuses => ({ ...prevStatuses, [question._id]: 'deleting' }));
        try {
            const response = await fetch(`http://localhost:3001/api/proposition/${question._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setQuestionStatuses(prevStatuses => ({ ...prevStatuses, [question._id]: 'deleted' }));
            setDeletedQuestions(prevState => ({ ...prevState, [question._id]: true }));
        } catch (error) {
            setQuestionStatuses(prevStatuses => ({ ...prevStatuses, [question._id]: 'error' }));
            setErrorMessage("Erreur lors de la suppression de la question.");
        }
    };

    if (questions.length === 0) {
        return (
            <div>
                <Navigation />
                <div className='noQuiz'>Pas de question en attente de validation</div>
            </div>
        );
    }

    return (


        <div className='adminpage'>

            <div className='nav'>
                <Navigation />
            </div>

            <div className='admin'>

                {questions.map((question, index) => (

                    <div className='questions' key={question._id || index} >

                        <label>
                            Question:
                            <input type='text' name='question' value={question.question} onChange={event => handleInputChange(index, event)} placeholder='non renseigné' required/>

                        </label>

                        <label>
                            Réponse:
                            <input type='text' name='answer' value={question.answer} onChange={event => handleInputChange(index, event)} placeholder='non renseigné' required/>

                        </label>

                        <label>
                            Image (URL):
                            <input type='text' name='image' value={question.image} onChange={event => handleInputChange(index, event)} placeholder='non renseigné' required/>

                        </label>


                        <p>Aperçu image:</p>
                        <img src={question.image} alt="" />


                        <p>Mauvaises réponses:</p>

                        <ul>
                            {question.wrongAnswers.map((wrongAnswer, arrayIndex) => (
                                <li key={arrayIndex}>
                                    <input type='text' value={wrongAnswer} onChange={event => handleArrayChange(index, arrayIndex, event)} placeholder='non renseigné' required/>
                                </li>
                            ))}
                        </ul>

                        <label>Catégorie:</label>
                        <select name='category' value={question.category} onChange={event => handleInputChange(index, event)}>
                            <option value="" disabled>Choisir</option>
                            {quizCategories.map((category, index) => <option key={index} value={category.toLowerCase()}>{category.toLowerCase()}</option>)}
                        </select>

                        <label>Difficulté:</label>
                        <select name='difficulty' value={question.difficulty} onChange={event => handleInputChange(index, event)}>
                            <option value="" disabled>Choisir</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </select>

                        {deletedQuestions[question._id]
                            ? <h4>Question supprimée</h4>
                            : <>
                                <button className='valider' disabled={questionStatuses[question._id] === 'submitting' || questionStatuses[question._id] === 'submitted'} onClick={() => handleSubmit(index)}>
                                    {questionStatuses[question._id] === 'submitting' ? "En cours..." : "Valider"}
                                </button>

                                <button className='supprimer' disabled={questionStatuses[question._id] === 'deleting' || questionStatuses[question._id] === 'deleted'} onClick={() => handleDelete(index)}>
                                    {questionStatuses[question._id] === 'deleting' ? "En cours..." : "Supprimer"}
                                </button>

                                {questionStatuses[question._id] === 'submitted' && <h3>Question validée</h3>}
                                {questionStatuses[question._id] === 'deleted' && <h4>Question supprimée</h4>}
                                {questionStatuses[question._id] === 'error' && <h5>Une erreur est survenue, tout vos champs sont ils renseignés ?</h5>}
                            </>
                        }

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;

