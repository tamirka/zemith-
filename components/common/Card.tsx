
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-4 md:p-6 ${className}`}>
      {title && <h3 className="text-xl font-semibold text-neutral-800 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
