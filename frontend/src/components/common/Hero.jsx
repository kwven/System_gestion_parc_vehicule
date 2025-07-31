import Card from './Card';
import { useState, useEffect } from "react";
import CardsGrid from './CardsGrid';
import Footer from './Footer';
import { TypewriterEffect } from "../ui/TypewriterEffect";
import { Link } from 'react-router-dom';

const images = [
  "sgvp_home1.webp",
  "sgvp_home2.webp",
  "sgvp_home3.webp",
  "sgvp_home4.webp",
];
const words = [
  { text: "Gestion " },
  { text: "de" },
  { text: "Parc" },
  { text: "de" },
  { text: "Véhicules" },
];
export default function Hero() {

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen bg-blue-100 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Background ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            currentImageIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
        <div className="absolute inset-0 bg-blue-200 bg-opacity-90 mix-blend-multiply"></div>
      </div>
      {/* Contenu avec layout responsive */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-x-8 gap-y-6 items-center">
        {/* Texte à gauche */}
        <div className="flex flex-col justify-center px-2 sm:px-4 lg:px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
            <TypewriterEffect words={words} />
            <span className="text-indigo-200"> Optimisez la gestion de parc avec une solution complète</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-blue-100 drop-shadow-md leading-relaxed">
            Suivi des missions, contrôle des coûts et tableaux de bord analytiques.
          </p>
            <div className='mt-6'>
              <Link to="/Login" className='button relative inline-block px-6 py-3 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 text-base md:text-lg' style={{background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'}}>
                Se connecter
                <div className="hoverEffect">
                  <div></div>
                </div>
              </Link>
            </div>
        </div>
        {/* Cartes à droite sur grand écran, dessous sur petit écran */}
        <div className="flex items-center justify-center h-full">
          <CardsGrid />
        </div>
      </div>
    </section>
  );
}