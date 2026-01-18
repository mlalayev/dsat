'use client';

import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-white/10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Zap className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold text-gradient">PrepPulse</span>
          </div>
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-400">
          <p>© 2026 PrepPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

