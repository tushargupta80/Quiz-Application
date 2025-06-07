// src/components/layout/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-6 text-center mt-auto">
      <p>&copy; {new Date().getFullYear()} AI Quiz Generator. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
        <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
      </div>
    </footer>
  );
}

export default Footer;