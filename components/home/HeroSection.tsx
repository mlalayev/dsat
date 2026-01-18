'use client';

import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Target, TrendingUp } from 'lucide-react';
import Button from '../common/Button';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const stats = [
  { number: '10,000+', label: 'Practice Questions', icon: BookOpen },
  { number: '50+', label: 'Topics Covered', icon: Target },
  { number: '95%', label: 'Score Improvement', icon: TrendingUp },
];

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div 
            variants={fadeInUp} 
            className="inline-flex items-center space-x-2 glass-effect px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">Trusted by 10,000+ students</span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Master Your SAT
            <br />
            <span className="text-gradient">With PrepPulse</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Experience the ultimate SAT preparation platform with realistic practice questions, 
            precise timing, and comprehensive analytics. Just like College Board's Bluebook, but better.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button href="/dashboard" variant="primary" size="md" showArrow>
              Start Practicing Now
            </Button>
            <Button variant="secondary" size="md">
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="glass-effect p-6 rounded-2xl">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-3xl font-bold mb-1">{stat.number}</h3>
                <p className="text-gray-300">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

