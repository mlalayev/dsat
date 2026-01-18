'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-6">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[1200px] glass-effect-strong"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold text-gradient">PrepPulse</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-blue-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-blue-400 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">
              Pricing
            </a>
            <Link href="/dashboard">
              <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </motion.header>
    </div>
  );
}

