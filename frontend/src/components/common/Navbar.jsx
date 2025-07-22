import React,{useState} from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';
function Navbar() {
    const  [nav,setNav] = useState(false);
    const handleNav = () => {
        setNav(!nav);
    }
    return (
        <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
            <h1 className="w-full text-3xl font-bold text-[#d6d8db]">SGVP</h1>
            <ul className='hidden md:flex'>
                <li> <Link to="/" className="p-4">Home</Link> </li>
                <li> <Link to="/About" className="p-4">About</Link> </li>
                <li> <Link to="/Help" className="p-4">Help</Link> </li>
                <li> <Link to="/Login" className="p-4">Login</Link> </li>
            </ul>
        </div>
    );
    }
export default Navbar;

