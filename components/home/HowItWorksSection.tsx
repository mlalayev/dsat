'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Choose Your Topic',
    description: 'Select from 50+ topics across all SAT sections. Focus on your weak areas or practice everything.'
  },
  {
    step: '02',
    title: 'Practice with Timer',
    description: 'Answer questions with realistic SAT timing. Build speed and accuracy under pressure.'
  },
  {
    step: '03',
    title: 'Review & Improve',
    description: 'Get instant feedback, detailed explanations, and track your progress over time.'
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="text-gradient">Effective</span> Process
          </h2>
          <p className="text-xl text-gray-300">
            Start improving your SAT score in three easy steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="glass-effect p-8 rounded-2xl">
                <div className="text-6xl font-bold text-gradient mb-4">{item.step}</div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
              {index < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

