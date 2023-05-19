import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BoutonTest from './Boutons/BoutonTest';
import CryptoJS from 'crypto-js';
import Navigation from './Navigation';
import '../styles/components/_logincomponent.scss';



const RegisterComponent = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si les deux mots de passe correspondent
    if (password !== password2) {
      setError("Les deux mots de passe ne correspondent pas.");
      return; // Ne pas aller plus loin si les mots de passe ne correspondent pas
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret key 123').toString();

    // Faire une requête POST vers l'API pour l'enregistrement de l'utilisateur
    try {
      const response = await fetch('https://geotopia-api.onrender.com/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'https://geotopia.onrender.com', // Autoriser le domaine d'origine
        },
        body: JSON.stringify({ username, email, encryptedPassword }),
      });
      if (response.ok) {
        // Rediriger vers la page de connexion si l'enregistrement est réussi
        window.location.href = '/';
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
      <h1>Crée-toi un compte</h1>
      <p>
        Tu as déjà un compte ? <Link to="/login">connecte-toi</Link>
      </p>

      <div className='form'>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            Pseudo
            <input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>

          <label htmlFor="email">
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

          <label htmlFor="password">
            confirmation du mot de passe
            <input
              type="password"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </label>

          <button type="submit">Créer un compte</button>
          {error && <p>{error}</p>}

        </form>
      </div>

      <BoutonTest />
    </div>
  );
};

export default RegisterComponent;
