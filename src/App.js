import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import About from './pages/About';
import ViewCountries from './pages/ViewCountries';
import Home from './pages/Home';
import ChoixModePage from './pages/ChoixModePage';
import RegisterPage from './pages/RegisterPage';
import LogInPage from './pages/LogInPage';
import PreGamePage from './pages/PreGamePage';
import InGamePage from './pages/InGamePage';
import PropositionsPage from './pages/PropositionsPage';
import Admin from './pages/Admin';
import { useState, useEffect } from 'react';
import BaseDonnée from './pages/BaseDonnée';


const accessToken = localStorage.getItem('accessToken');


const PrivateRoute = ({ children }) => {
  return accessToken ? children : <Navigate to="/login" replace />;
};


const App = () => {

  const [role, setRole] = useState(null);
  const [isValidToken, setIsValidToken] = useState(false);

  const accessToken = localStorage.getItem('accessToken');
  const AdminRoute = ({ children }) => {
    return role === 'admin' ? children : <Navigate to="/" replace />;
  };


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
        setRole(data.role);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      });
  }, []);

  


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<PrivateRoute><About /></PrivateRoute>} />
        
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/bd" element={<AdminRoute><BaseDonnée /></AdminRoute>} />

        <Route path='/quiz' element={<PrivateRoute><ChoixModePage /></PrivateRoute>} />
        <Route path='/registration' element={<RegisterPage />} />
        <Route path='/login' element={<LogInPage />} />
        <Route path="/quiz/:id" element={<PrivateRoute><PreGamePage /></PrivateRoute>} />
        <Route path="/ingame/:id" element={<PrivateRoute><InGamePage /></PrivateRoute>} />
        <Route path="/viewcountries" element={<PrivateRoute><ViewCountries /></PrivateRoute>} />
        <Route path="/proposition" element={<PrivateRoute><PropositionsPage /></PrivateRoute>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
