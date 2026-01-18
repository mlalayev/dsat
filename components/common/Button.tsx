'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  showArrow?: boolean;
}

export default function Button({ 
  children, 
  href, 
  variant = 'primary', 
  size = 'md',
  onClick,
  className = '',
  showArrow = false
}: ButtonProps) {
  const baseStyles = 'rounded-full font-semibold transition-all flex items-center space-x-2';
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-2xl hover:shadow-blue-500/50',
    secondary: 'glass-effect hover:bg-white/20'
  };

  const sizeStyles = {
    sm: 'px-6 py-2 text-base',
    md: 'px-8 py-4 text-lg',
    lg: 'px-10 py-5 text-xl'
  };

  const classes = `group ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        <span>{children}</span>
        {showArrow && <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${size === 'lg' ? 'w-6 h-6' : ''}`} />}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      <span>{children}</span>
      {showArrow && <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${size === 'lg' ? 'w-6 h-6' : ''}`} />}
    </button>
  );
}

