'use client';

import { motion } from 'framer-motion';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Brain,
  Award
} from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: 'Realistic Timing',
    description: 'Practice with actual SAT timing conditions. Track your pace and improve time management.',
    color: 'text-blue-400'
  },
  {
    icon: Brain,
    title: 'Smart Question Bank',
    description: 'Access thousands of high-quality questions organized by topic and difficulty level.',
    color: 'text-purple-400'
  },
  {
    icon: Target,
    title: 'Topic Selection',
    description: 'Focus on specific areas. Choose from 50+ topics across Math, Reading, and Writing.',
    color: 'text-pink-400'
  },
  {
    icon: CheckCircle2,
    title: 'Instant Feedback',
    description: 'Get detailed explanations for every question. Understand your mistakes and learn faster.',
    color: 'text-green-400'
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Track your improvement with detailed analytics and personalized insights.',
    color: 'text-yellow-400'
  },
  {
    icon: Award,
    title: 'Full Practice Tests',
    description: 'Take complete SAT practice tests in a realistic digital environment.',
    color: 'text-red-400'
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to <span className="text-gradient">Excel</span>
          </h2>
          <p className="text-xl text-gray-300">
            Powerful features designed to maximize your SAT score
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="glass-effect p-6 rounded-2xl hover:bg-white/15 transition-all"
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mb-4`} />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

