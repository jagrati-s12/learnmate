import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div className={`bg-[#211C18] rounded-2xl border border-[rgba(243,237,227,0.08)] shadow-sm shadow-sm overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }: CardProps) => (
  <div className={`px-6 py-4 border-b border-[rgba(243,237,227,0.08)] ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }: CardProps) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }: CardProps) => (
  <div className={`px-6 py-4 bg-[#28211C] border-t border-[rgba(243,237,227,0.08)] flex items-center ${className}`} {...props}>
    {children}
  </div>
);
