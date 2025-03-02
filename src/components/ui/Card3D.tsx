
import { useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

const Card3D = ({
  children,
  className = '',
  intensity = 10,
  glare = false
}: Card3DProps) => {
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out'
  });
  
  const [glareStyle, setGlareStyle] = useState({
    transform: 'translateZ(0) translate(-50%, -50%)',
    backgroundImage: 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%)',
    opacity: 0
  });
  
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Normalize rotation values between -1 and 1
    const rotateY = (mouseX / (rect.width / 2)) * (intensity / 10);
    const rotateX = -1 * (mouseY / (rect.height / 2)) * (intensity / 10);
    
    // Update 3D transform
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      boxShadow: `
        ${rotateY * 5}px ${rotateX * 5}px 30px -5px rgba(0, 0, 0, 0.1),
        0 10px 20px -5px rgba(0, 0, 0, 0.04)
      `,
      transition: 'none'
    });
    
    // Update glare position if enabled
    if (glare) {
      const glareX = ((mouseX / rect.width) * 100) + 50;
      const glareY = ((mouseY / rect.height) * 100) + 50;
      
      setGlareStyle({
        transform: `translateZ(0) translate(${glareX}%, ${glareY}%)`,
        backgroundImage: 'linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 100%)',
        opacity: 0.8
      });
    }
  };
  
  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
    });
    
    if (glare) {
      setGlareStyle({
        ...glareStyle,
        opacity: 0,
        transition: 'opacity 0.3s ease-out'
      });
    }
  };
  
  return (
    <div
      ref={cardRef}
      className={cn('card-3d relative overflow-hidden', className)}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-content relative z-10">
        {children}
      </div>
      
      {glare && (
        <div 
          className="absolute inset-0 w-[200%] h-[200%] pointer-events-none transition-opacity"
          style={glareStyle}
        />
      )}
    </div>
  );
};

export default Card3D;
