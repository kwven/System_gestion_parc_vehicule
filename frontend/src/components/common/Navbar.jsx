import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Qui sommes-nous ?', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'connexion', href: '/login' },
  ];

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl px-8 mx-auto sm:px-8 lg:px-5">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
          <img src={'logo.png'} alt="SGVP" className="h-15" />
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-700">
            {links.map(({ label, href }) => (
              <a key={label} href={href} className="hover:text-indigo-600">
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile button */}
          <div className="md:hidden">
            <button onClick={() => setOpen(!open)}>
              {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map(({ label, href }) => (
              <a key={label} href={href} className="block px-3 py-2 text-gray-700 hover:text-indigo-600">
                {label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
