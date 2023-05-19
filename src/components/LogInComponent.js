import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BoutonTest from './Boutons/BoutonTest';
import CryptoJS from 'crypto-js';
import '../styles/components/_logincomponent.scss';
import Navigation from './Navigation';


const LogInComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret key 123').toString();

        // Faire une requête POST vers l'API pour l'enregistrement de l'utilisateur
        try {
            const response = await fetch('https://geotopia-api.onrender.com/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'http://localhost:3000', // Autoriser le domaine d'origine
                },
                body: JSON.stringify({ email, encryptedPassword }),
            });
            if (response.ok) {
                const data = await response.json();
                const accessToken = data.accessToken; // Récupérer l'accessToken du corps de la réponse
                // Stocker l'accessToken dans le localStorage ou dans un autre moyen de stockage sécurisé de votre choix
                localStorage.setItem('accessToken', accessToken);
                console.log(accessToken);
                // Rediriger vers la page home si l'enregistrement est réussi
                window.location.href = '/home';
            } else {
                // Afficher une erreur si l'enregistrement échoue
                const data = await response.json();
                setError(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='comp'>
            <Navigation />
            <h1>Connecte toi</h1>

            <p>
                Tu n'as pas encore de compte ? <Link to="/registration">inscris-toi</Link>
            </p>

            <div className='form'>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='email'>
                        Email
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>

                    <label htmlFor="password">
                        Mot de passe
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>


                    <button type="submit">Connexion</button>
                </form>
            </div>



            {error && <p>{error}</p>}

            <BoutonTest />
        </div>
    );
};

export default LogInComponent;