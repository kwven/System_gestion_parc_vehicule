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
    <>
      <section className="relative w-full bg-blue-100">
        {/* Background image fixée avec blend pour effet ciel */}
        <div className="absolute inset-0 z-0">
          {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
          <div className="absolute inset-0 bg-blue-200 bg-opacity-90 mix-blend-multiply"></div>
        </div>
        {/* Contenu avec layout responsive */}
        <div className="relative z-10 max-w-7xl mx-auto py-23 grid md:grid-cols-2 gap-x-30 gap-y-10 items-start">
          {/* Texte à gauche */}
          <div className="px-28 sm:px-28 lg:px-15">
            
            <h1 className="text-4xl md:text-4xl font-extrabold text-white leading-tight drop-shadow">
              <TypewriterEffect words={words} />
              <span className="text-indigo-200"> Optimisez la gestion de parc avec une solution complète</span>
            </h1>
            <p className="mt-4 text-blue-100 drop-shadow">
              suivi des missions, contrôle des coûts et tableaux de bord analytiques.
            </p>
              <div className='mt-8'>
                <Link to="/Login" className='button relative inline-block px-8 py-3 text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105' style={{background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'}}>
                  se connecter
                  <div className="hoverEffect">
                    <div></div>
                  </div>
                </Link>
              </div>
          </div>
          {/* Cartes à droite sur grand écran, dessous sur petit écran */}
          <CardsGrid />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            </div>
        </div>
      </section>
    </>
  );
}