function AnimationStyles() {
  return (
    <style>{`
      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      
      .animate-spin-slow {
        animation: spin-slow 4s linear infinite;
      }
      
      @keyframes drift {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .animate-drift {
        animation: drift 25s infinite linear;
      }
    `}</style>
  );
}

export default AnimationStyles;