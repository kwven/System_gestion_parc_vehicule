import React from 'react';
import { Link } from 'react-router-dom';
function Hero() {
    return (
    <div className='text-white'>
      <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
        <p className='text-[#307cec] font-bold p-2'>
          Solution complète pour la gestion de votre flotte de véhicules
        </p>
        <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6'>
          Système de Gestion de Parc de Véhicules
        </h1>
      </div>
      <div className='justify-center h-screen flex flex-col max-w-[190px] mt-[-780px] w-full text-center mx-auto'>
        <button><Link to="/Login" className='button'>Get Started
          <div class="hoverEffect">
          <div></div>
          </div>
        </Link></button>
      </div>
    </div>
    
  );
}

export default Hero;
