export function Shape3D({ type, className }: { type: 'cube' | 'torus' | 'half-round', className?: string }) {
  if (type === 'cube') {
    return (
      <div className={`relative w-24 h-24 ${className} animate-float`}>
        <div className="absolute inset-0 bg-purple-500 rounded-lg shadow-2xl opacity-80 backdrop-blur-md rotate-12 transform-gpu"></div>
        <div className="absolute inset-0 bg-purple-400 rounded-lg shadow-xl opacity-60 backdrop-blur-sm -rotate-12 translate-x-4 translate-y-4 transform-gpu"></div>
      </div>
    );
  }
  
  if (type === 'half-round') {
    return (
      <div className={`relative w-32 h-16 overflow-hidden ${className} animate-float`} style={{ animationDelay: '1s' }}>
        <div className="w-32 h-32 bg-primary rounded-full shadow-2xl opacity-90"></div>
      </div>
    );
  }

  if (type === 'torus') {
    return (
      <div className={`relative w-32 h-32 rounded-full border-[16px] border-primary shadow-2xl opacity-80 ${className} animate-rotate-slow`}></div>
    );
  }

  return null;
}
