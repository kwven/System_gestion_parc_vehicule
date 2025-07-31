import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Hero from '../components/common/Hero';
function Home() {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Hero />
      </div>
    </div>
  );
}

export default Home;