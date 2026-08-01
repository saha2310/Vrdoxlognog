import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-[#e67e22] text-white hover:bg-[#d35400]',
    secondary: 'bg-[#ecf0f1] text-[#2c3e50] hover:bg-[#e67e22] hover:text-white',
    outline: 'border-2 border-[#ddd] bg-white hover:border-[#e67e22] text-[#2c3e50]',
  };
  return (
    <button className={cn('px-5 py-2.5 rounded-full font-semibold transition-all duration-300 cursor-pointer', variants[variant], className)} {...props} />
  );
}
