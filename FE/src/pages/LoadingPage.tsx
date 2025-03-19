import BubbleCanvas from '@/components/loading/BubbleCanvas';
import { LoadingPageProps } from '@/types/Loading';

function LoadingPage({ message }: LoadingPageProps) {
  return (
    <div className="h-screen w-screen">
      <BubbleCanvas message={message} />
    </div>
  );
}

export default LoadingPage;