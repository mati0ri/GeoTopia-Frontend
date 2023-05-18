import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/components/_sedeconnecter.scss';
import { useState } from 'react';
//import '../styles/components/_sedeconnecter.scss';



const HandleClick = (e) => {
    e.preventDefault();
    // Remove the access token from local storage
    localStorage.removeItem('accessToken');
    // Redirect the user to the home page or login page
    window.location.href = '/home';
};


const SeDeconnecter = () => {
    return (
        <div className='deco'>

            <label onClick={HandleClick}>Se déconnecter</label>

        </div>
    );
};

export default SeDeconnecter;