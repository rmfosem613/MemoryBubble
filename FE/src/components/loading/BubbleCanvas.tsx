import useBubbleAnimation from '@/hooks/useLoading';
import { LoadingPageProps } from '@/types/Loading';

function BubbleCanvas({ message }: LoadingPageProps) {

  const { canvasRef } = useBubbleAnimation();

  return (
    <div className="h-full w-full relative bg-blue-300">
      <canvas
        ref={canvasRef}
        className="block w-full h-full relative z-10"
      />
      <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
      font-p-500 text-h3-lg text-white p-2">
        {message}
      </p>
    </div>
  );
};

export default BubbleCanvas;