// Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link to="/">NAPS Finance</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/market" className="text-white hover:text-gray-200">Market</Link>
          </li>
          <li>
            <Link to="/profile" className="text-white hover:text-gray-200">Profile</Link>
          </li>
          <li>
            <Link to="/settings" className="text-white hover:text-gray-200">Settings</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;