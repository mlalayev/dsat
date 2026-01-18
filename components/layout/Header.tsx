'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.div 
      className="fixed left-0 right-0 z-50 flex justify-center px-6"
      animate={{
        top: isScrolled ? 16 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-[1200px] rounded-2xl transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl' 
            : 'bg-transparent backdrop-blur-none border-transparent'
        }`}
      >
        <motion.div 
          className="px-6 flex items-center justify-between"
          animate={{
            paddingTop: isScrolled ? '0.5rem' : '1rem',
            paddingBottom: isScrolled ? '0.5rem' : '1rem',
          }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              animate={{
                scale: isScrolled ? 0.9 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-8 h-8 text-blue-400" />
            </motion.div>
            <motion.span 
              className="text-2xl font-bold text-gradient"
              animate={{
                fontSize: isScrolled ? '1.5rem' : '1.75rem',
              }}
              transition={{ duration: 0.3 }}
            >
              PrepPulse
            </motion.span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-blue-400 transition-colors">
              Pricing
            </a>
            <Link href="/dashboard">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold text-white">
                Get Started
              </button>
            </Link>
          </div>
        </motion.div>
      </motion.header>
    </motion.div>
  );
}

