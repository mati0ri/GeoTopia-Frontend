import React from 'react';

const Logo = () => {
    return (
        <div className="logo">
            {/*pour les sources img cest comme si on etait de base dans "public"*/}
            <img src="./logo.png" alt="logo geotopia" />
        </div>
    );
};

export default Logo;