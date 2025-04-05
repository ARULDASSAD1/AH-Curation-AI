
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Zap } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl font-bold">AH Curation - AI </span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
              <Zap className="h-4 w-4 mr-1" />
              <span>AI-Powered Recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
