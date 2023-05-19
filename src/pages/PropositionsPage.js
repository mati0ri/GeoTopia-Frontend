import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import '../styles/components/_propositionspage.scss';

const PropositionsPage = () => {
    const [question, setQuestion] = useState('');
    const [answer, setText1] = useState('');
    const [image, setText2] = useState('');
    const [text3, setText3] = useState('');
    const [text4, setText4] = useState('');
    const [text5, setText5] = useState('');
    const [message, setMessage] = useState(''); // Ajouter une variable d'état pour le message

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Vérifier si les champs "question" et "réponse" ont été remplis
        if (!question || !answer) {
            setMessage('Les champs question et réponses sont obligatoires');
            setTimeout(() => setMessage(''), 5000);
            return;
        }

        const accessToken = localStorage.getItem('accessToken');

        const data = { question, answer, image, wrongAnswers: [text3, text4, text5] };

        try {
            const response = await fetch('https://geotopia-api.onrender.com/api/proposition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}` // Ajouter l'accessToken dans le header d'autorisation
                },
                body: JSON.stringify(data),
            });
            const json = await response.json();
            console.log(json);

            // Vider les champs et afficher le message
            setQuestion('');
            setText1('');
            setText2('');
            setText3('');
            setText4('');
            setText5('');
            setMessage('Question envoyée');
            setTimeout(() => setMessage(''), 5000);

        } catch (error) {
            console.error('Erreur:', error);
        }
    };


    return (
        <div>
            <div className='nav'>
                <Navigation />
            </div>
            <div className='texte'>Propose nous ta question</div>
            {/*<div className='texte2'>cela nous aide à alimenter notre base de donnée</div>*/}
            <div className='texte3'>si un administrateur la valide, tu auras peut etre la chance de la voir en quiz !</div>

            <div className='proposition'>
                <form onSubmit={handleSubmit}>
                    <label>
                        Question
                        <input type="text" value={question} onChange={e => setQuestion(e.target.value)} required />
                    </label>
                    <label>
                        Réponse
                        <input type="text" value={answer} onChange={e => setText1(e.target.value)} required />
                    </label>
                    <label>
                        image (copiez l'url de l'image, veillez à ce qu'elle soit libre de droit !)
                        <input type="text" value={image} onChange={e => setText2(e.target.value)} placeholder="facultatif" />
                    </label>
                    <label>
                        mauvaise réponse 1
                        <input type="text" value={text3} onChange={e => setText3(e.target.value)} placeholder="facultatif" />
                    </label>
                    <label>
                        mauvaise réponse 2
                        <input type="text" value={text4} onChange={e => setText4(e.target.value)} placeholder="facultatif" />
                    </label>
                    <label>
                        mauvaise réponse 3
                        <input type="text" value={text5} onChange={e => setText5(e.target.value)} placeholder="facultatif" />
                    </label>

                    <button type="submit">Envoyer</button>

                    {message && <p>{message}</p>} {/* Afficher le message ici */}

                </form>
            </div>
        </div>
    );

};

export default PropositionsPage;

