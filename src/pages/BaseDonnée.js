import React, { useEffect, useState } from 'react';
import Navigation from '../components/Navigation';
import '../styles/components/_bd.scss';


const BaseDonnée = () => {

    const [quizCategories, setQuizCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [questions, setQuestions] = useState([]);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        question: "",
        answer: "",
        category: "",
        difficulty: "",
        image: "",
        wrongAnswers: ["", "", ""]
    });

    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchQuizCategories();
    }, []);

    const fetchQuizCategories = async () => {
        try {
            const response = await fetch('https://geotopia-api.onrender.com/api/quiz', {
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

    //sert juste a log les reponses
    const logAnswers = () => {
        const answers = questions.map(question => question.answer);
        console.log(answers);
    };

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`https://geotopia-api.onrender.com/api/question/allFromCategory/${selectedCategory.toLowerCase()}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            setQuestions(data);
            console.log(data);
            logAnswers();
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const handleSelectChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const deleteQuestion = async (id) => {
        try {
            const response = await fetch(`https://geotopia-api.onrender.com/api/question/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                // Si la suppression est réussie, retirez la question de l'état
                setQuestions(questions.filter(question => question._id !== id));
            } else {
                console.error('Erreur lors de la suppression de la question:', response);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de la question:', error);
        }
    };

    const handleEditClick = (question) => {
        setEditingQuestionId(question._id);
        setEditingQuestion(question);
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`https://geotopia-api.onrender.com/api/question/${editingQuestionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(editingQuestion),
            });

            if (response.ok) {
                const updatedQuestion = await response.json();
                setQuestions(questions.map((question) =>
                    question._id === editingQuestionId ? updatedQuestion : question
                ));
                setEditingQuestionId(null);
                setEditingQuestion(null);
            } else {
                console.error('Error updating question:', response);
            }
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditingQuestion({
            ...editingQuestion,
            [name]: value
        });
    };


    const handleWrongAnswerChange = (event, index) => {
        const newWrongAnswers = [...editingQuestion.wrongAnswers];
        newWrongAnswers[index] = event.target.value;
        setEditingQuestion({
            ...editingQuestion,
            wrongAnswers: newWrongAnswers
        });
    };


    const handleNewQuestionChange = (event) => {
        const { name, value } = event.target;
        setNewQuestion({
            ...newQuestion,
            [name]: value
        });
    };

    const handleNewWrongAnswerChange = (event, index) => {
        const newWrongAnswers = [...newQuestion.wrongAnswers];
        newWrongAnswers[index] = event.target.value;
        setNewQuestion({
            ...newQuestion,
            wrongAnswers: newWrongAnswers
        });
    };

    const addQuestion = async () => {
        try {
            const response = await fetch('https://geotopia-api.onrender.com/api/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify(newQuestion),
            });

            if (response.ok) {
                const addedQuestion = await response.json();
                setQuestions([...questions, addedQuestion]);
                setShowAddForm(false);
                setNewQuestion({
                    question: "",
                    answer: "",
                    category: "",
                    difficulty: "",
                    image: "",
                    wrongAnswers: ["", "", ""]
                });
            } else {
                console.error('Error adding question:', response);
            }
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };



    return (
        <div className='bd'>
            <Navigation />
            <h1>Notre base de donnée</h1>
            <h5>rechercher les questions de la catégorie séléctionnée<br />+ pour ajouter une question </h5>
            <button onClick={() => setShowAddForm(!showAddForm)}>+</button>
            {showAddForm && (
                <div>
                    <input
                        type="text"
                        value={newQuestion.question}
                        name="question"
                        onChange={handleNewQuestionChange}
                        placeholder="Question"
                        required
                    />
                    <input
                        type="text"
                        value={newQuestion.answer}
                        name="answer"
                        onChange={handleNewQuestionChange}
                        placeholder="Réponse"
                        required
                    />
                    <select
                        value={newQuestion.category}
                        name="category"
                        onChange={handleNewQuestionChange}
                        required
                    >
                        <option value="">--Choisissez une catégorie--</option>
                        {quizCategories.map(category => (
                            <option key={category} value={category.toLowerCase()}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <select
                        value={newQuestion.difficulty}
                        name="difficulty"
                        onChange={handleNewQuestionChange}
                        required
                    >
                        <option value="">--Choisissez une difficulté--</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select>
                    <input
                        type="text"
                        value={newQuestion.image}
                        name="image"
                        onChange={handleNewQuestionChange}
                        placeholder="Url"
                        required
                    />
                    <img src={newQuestion.image} alt="Preview" />
                    {newQuestion.wrongAnswers.map((answer, index) => (
                        <input
                            key={index}
                            type="text"
                            value={answer}
                            onChange={(event) => handleNewWrongAnswerChange(event, index)}
                            placeholder={`Mauvaise réponse ${index + 1}`}
                            required
                        />
                    ))}
                    <button onClick={addQuestion}>Ajouter la question</button>
                </div>
            )}
            <select value={selectedCategory} onChange={handleSelectChange}>
                <option value="">--Choisissez une catégorie--</option>
                {quizCategories.map(category => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
            <button onClick={fetchQuestions}>Rechercher</button>
            <ul>
                {questions.map((question) => (
                    <li key={question._id}>
                        <div className='affichage'>

                            <div className='id'>id: {question._id}</div>

                            <p><span className='lab'>Question: </span>
                                {editingQuestionId === question._id ? (
                                    <input
                                        type="text"
                                        value={editingQuestion.question}
                                        name="question"
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span>{question.question}</span>
                                )}
                            </p>

                            <p><span className='lab'>Réponse: </span>
                                {editingQuestionId === question._id ? (
                                    <input
                                        type="text"
                                        value={editingQuestion.answer}
                                        name="answer"
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span>{question.answer}</span>
                                )}
                            </p>

                            <p><span className='lab'>Catégorie: </span>
                                {editingQuestionId === question._id ? (
                                    <select
                                        value={editingQuestion.category}
                                        name="category"
                                        onChange={handleInputChange}
                                    >
                                        <option value="">--Choisissez une catégorie--</option>
                                        {quizCategories.map(category => (
                                            <option key={category} value={category.toLowerCase()}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{question.category}</span>
                                )}
                            </p>


                            <p><span className='lab'>Difficulté: </span>
                                {editingQuestionId === question._id ? (
                                    <select
                                        value={editingQuestion.difficulty}
                                        name="difficulty"
                                        onChange={handleInputChange}
                                    >
                                        <option value="">--Choisissez une difficulté--</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                ) : (
                                    <span>{question.difficulty}</span>
                                )}
                            </p>


                            <p><span className='lab'>Url: </span>
                                {editingQuestionId === question._id ? (
                                    <input
                                        type="text"
                                        value={editingQuestion.image}
                                        name="image"
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <span className='url'>{question.image}</span>
                                )}
                            </p>

                            <img src={question.image} alt="question" />

                            <p><span className='lab'>Mauvaises réponses: </span>
                                {editingQuestionId === question._id ? (
                                    editingQuestion.wrongAnswers.map((answer, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={answer}
                                            onChange={(event) => handleWrongAnswerChange(event, index)}
                                        />
                                    ))
                                ) : (
                                    question.wrongAnswers.map((answer, index) => (
                                        <span key={index}> {answer} </span>
                                    ))
                                )}
                            </p>

                            {editingQuestionId === question._id ? (
                                <button type="button" onClick={handleUpdate}>Valider</button>
                            ) : (
                                <button onClick={() => handleEditClick(question)}>Modifier</button>
                            )}
                            <button onClick={() => deleteQuestion(question._id)}>Supprimer</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BaseDonnée;