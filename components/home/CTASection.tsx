'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import Button from '../common/Button';

export default function CTASection() {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="glass-effect p-12 rounded-3xl text-center"
        >
          <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Ace Your SAT?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who improved their scores with PrepPulse
          </p>
          <Button href="/dashboard" variant="primary" size="lg" showArrow>
            Start Your Journey
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

