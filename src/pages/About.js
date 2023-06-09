import Navigation from '../components/Navigation';
import '../styles/components/_about.scss'
import React, { useState, useEffect } from 'react';
import { unstable_createChainedFunction } from '@mui/utils';


const About = () => {

    const [username, setUsername] = useState(null);
    const [titre, setTitre] = useState(null);
    const [scoreTot, setScoreTot] = useState(null);
    const [id, setId] = useState(null);
    const [ranking, setRanking] = useState(null);
    const [userCount, setUserCount] = useState(0);
    const [passages, setPassages] = useState(null);

    const [loadingUserData, setLoadingUserData] = useState(true);
    const [loadingRanking, setLoadingRanking] = useState(true);
    const [loadingUserCount, setLoadingUserCount] = useState(true);
    const [loadingPassages, setLoadingPassages] = useState(true);

    const [updateTotalScore, setupdateTotalScore] = useState(true);
    const [updateTitre, setupdateTitre] = useState(true);

    const accessToken = localStorage.getItem('accessToken'); // Récupérer l'accessToken depuis le localStorage


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('https://geotopia-api.onrender.com/api/user/current', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await response.json();

                setUsername(data.username);
                //setTitre(data.titre);
                setScoreTot(data.scoreTot);
                setId(data.id);
                setLoadingUserData(false);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
            }
        };
        fetchUserData();
    }, []);



    useEffect(() => {
        // Ne faire l'appel à l'API que si l'id est défini
        if (id) {
            // Appeler l'API /api/user/ranking pour récupérer le classement de l'utilisateur connecté
            fetch(`https://geotopia-api.onrender.com/api/user/ranking/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Ajouter l'accessToken dans le header d'autorisation
                }
            })
                .then(response => response.json())
                .then(data => {
                    // Mettre à jour l'état avec le classement de l'utilisateur
                    setRanking(data.ranking);
                    setLoadingRanking(false);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération du classement:', error);
                });
        }
    }, [id, scoreTot]);  // Mettre à jour lorsque les données de l'utilisateur sont mises à jour



    useEffect(() => {
        fetch('https://geotopia-api.onrender.com/api/user/count')
            .then(response => response.json())
            .then(data => { setUserCount(data.count); setLoadingUserCount(false) })
            .catch(error => console.error('Erreur lors de la récupération du nombre d\'utilisateurs:', error));
    }, []);



    useEffect(() => {
        if (username) {
            fetch(`https://geotopia-api.onrender.com/api/passage/${username}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setPassages(data);
                    setLoadingPassages(false);
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des passages:', error);
                });
        } else {
            setPassages([]);
            setLoadingPassages(false);
        }
    }, [username]);

    const totalScore = passages ? passages.length > 0 ? passages.reduce((total, passage) => total + passage.score, 0) : 0 : 0;

    // Mettre à jour le score total de l'utilisateur dans la base de données chaque fois que totalScore change
    useEffect(() => {
        const updateTotalScore = async () => {
            if (id) { // Ne faire l'appel API que si l'id est défini
                try {
                    await fetch(`https://geotopia-api.onrender.com/api/user/updateScore/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({ scoreTot: totalScore })
                    });
                    setScoreTot(totalScore);
                    setupdateTotalScore(false);
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du score total:', error);
                }
            }
        };
        updateTotalScore();
    }, [totalScore, id, accessToken]);

    // Mettre à jour le titre de l'utilisateur dans la base de données chaque fois que totalScore change
    useEffect(() => {
        const updateTitre = async () => {
            if (id && ranking) { // Ne faire l'appel API que si l'id est défini
                let nouveauTitre;
    
                if (totalScore < 40) {
                    nouveauTitre = "l'astéroïde";
                }
                else if (totalScore < 100) {
                    nouveauTitre = "la lune";
                }
                else if (totalScore < 250) {
                    nouveauTitre = "la terre";
                }
                else if (totalScore < 400) {
                    nouveauTitre = "le soleil";
                }
                else if (totalScore < 600) {
                    nouveauTitre = "la nébuleuse";
                }
                else if (totalScore < 799) {
                    nouveauTitre = "la supernova";
                }
                else if (totalScore === 800) {
                    nouveauTitre = "le trou noir";
                }
                else {
                    nouveauTitre = "la tricheuse";
                }
    
                try {
                    await fetch(`https://geotopia-api.onrender.com/api/user/updateTitre/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`
                        },
                        body: JSON.stringify({ titre: nouveauTitre })
                    });
                    setTitre(nouveauTitre);
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du titre:', error);
                } finally {
                    setupdateTitre(false);
                }
            }
        };
        updateTitre();
    }, [totalScore, id, accessToken]);
    


    if (loadingUserData || loadingRanking || loadingUserCount || loadingPassages || updateTotalScore || updateTitre) {
        return <div className='statspage'>
            <Navigation />
            <h1>Chargement des informations... <br /></h1>
            <p>(si tu n'as jamais joué, reviens après ta première partie</p>
            <p>sinon, recharge la page)</p>
        </div>;
    }


    return (
        <div className='statspage'>
            <Navigation />

            <h1>TON profil</h1>

            <div className='stats'>


                <div className='score'>
                    <p>score total</p>
                    <h4>{totalScore}<span className='pourcent'>%</span></h4>
                    <h3>Ton score total correspond à la somme de tes meilleurs scores pour chaque quiz disponible</h3>
                </div>

                <div className='titre'>
                    <p>titre</p>
                    <h4><span className='username'>{`${username}`}</span> {titre}</h4>
                    <h3>Ton titre correspond à ton niveau dans le jeu, améliore tes scores pour progresser</h3>
                </div>

                <div className='classement'>
                    <p>classement</p>
                    <h4>{ranking}<span className='userCount'>{`/${userCount}`}</span></h4>
                    <h3>tu es classé {ranking}{ranking === 1 ? 'er' : 'ème'} sur {userCount} personnes ayant créé un compte</h3>
                </div>

            </div>
        </div>
    );

};

export default About;