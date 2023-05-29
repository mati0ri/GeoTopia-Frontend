import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import Navigation from '../components/Navigation';
import RegisterPage from '../components/RegisterComponent';
import SeConnecter from '../components/SeConnecter';
import SeDeconnecter from '../components/seDeconnecter';
import '../styles/components/_home.scss';


const Home = () => {


    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(true);


    const accessToken = localStorage.getItem('accessToken'); // Récupérer l'accessToken depuis le localStorage


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
                setEmail(data.email);
                setLoading(false);

            })
            .catch(error => {
                console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
                setLoading(false);

            });
    }, []);


    if (loading) {
        return (
            <div className='accueil' style={{ marginTop: '5rem' }}>
                <Navigation />
                <div className='nom2' style={{ marginTop: '24rem' }}>chargement</div>
                <div className='info'>Il arrive que la récupération de données<br />soit assez longue, désolé</div>
            </div>
        )
    }

    return (
        <div className='accueil' style={{ marginTop: '5rem' }}>
            <Navigation />

            {!username && <div className='nom2'>connecte toi pour acceder au site</div>}
            {!username && <SeConnecter />}


            <div className='home' style={{ marginTop: '55vh' }}>

                {/*<Logo />*/}

                {username && <div className='nom'>Bonjour {username}...</div>}
                {username && <div className='nom2'>bienvenue dans géotopia</div>}
                {username && <div className='info'>Une plateforme de quiz ludique basée<br />sur des jeux géographiques</div>}
                {username && <SeDeconnecter />}

                {/*email && <div className='infos'>Ton email : {email}</div>*/}


            </div>
        </div>
    );
};

export default Home;