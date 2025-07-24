import React from 'react';
import '../../index.css'; // make sure to import your CSS

function Card({ title, description, image }) {
  return (
    <div className="card">
      {/* Front visual: small centered icon (img or SVG) */}
      <img src={image} alt={title} className="icon" />

      {/* Flipping back content */}
      <div className="card__content">
        <p className="card__title">{title}</p>
        <p className="card__description">{description}</p>
      </div>
    </div>
  );
}

export default Card;
