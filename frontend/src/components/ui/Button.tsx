import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-[#C9A66B] text-[#171411] hover:bg-[#A8895C] focus:ring-[#C9A66B]',
    secondary: 'bg-[#302821] text-[#F3EDE3] hover:bg-gray-200 focus:ring-[#C9A66B]',
    outline: 'border border-[rgba(243,237,227,0.10)] text-[#C8BFB2] bg-transparent hover:bg-[#28211C] focus:ring-[#C9A66B]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-[#C8BFB2] hover:bg-[#302821] hover:text-[#F3EDE3] focus:ring-[#C9A66B]'
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};
