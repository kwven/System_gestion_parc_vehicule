
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

function Layout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header title={title} />
        <main className="flex-grow p-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;