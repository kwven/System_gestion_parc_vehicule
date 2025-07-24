import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Hero from '../components/common/Hero';
function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
    </div>
  );
}

export default Home;