import Card from './Card';
import { useState, useEffect } from "react";
import CardsGrid from './CardsGrid';
import Footer from './Footer';

const images = [
  "image1_sgpv.jpg",
  "image2_sgpv.avif",
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
        <div className="relative z-10 max-w-7xl mx-auto py-31 grid md:grid-cols-2 gap-x-30 gap-y-10 items-start">
          {/* Texte à gauche */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight drop-shadow">
              Gestion Intelligente de Parc de Véhicules
              <span className="text-indigo-200"> Optimisez la gestion de votre flotte avec une solution complète</span>
            </h1>
            <p className="mt-6 text-blue-100 drop-shadow">
              suivi des missions, contrôle des coûts et tableaux de bord analytiques.
            </p>
            <div className="mt-8 space-x-4">
              <a
                href="#decouvrir"
                className="inline-block rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500"
              >
                Découvrir nos offres
              </a>
              <a
                href="#contact"
                className="inline-block rounded-md border border-white px-5 py-3 text-sm font-semibold text-white hover:bg-white hover:text-indigo-700"
              >
                Contactez-nous
              </a>
            </div>
          </div>

          {/* Cartes à droite sur grand écran, dessous sur petit écran */}
          <CardsGrid />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-5 gap-12">
            
          </div>
        </div>
      </section>
      
      {/* Footer ajouté à la fin de la page */}
      <Footer />
    </>
  );
}