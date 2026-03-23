import { motion } from 'framer-motion';

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-1 h-3',
    md: 'w-1.5 h-4',
    lg: 'w-2 h-6'
  };

  return (
    <div className="flex justify-center items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${sizes[size]} bg-primary rounded-full`}
          animate={{
            scaleY: [1, 2, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
