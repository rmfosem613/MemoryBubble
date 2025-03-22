import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

interface AlertProps {
  message: string;
  color: string;
}

// color 예시 : green, red
const Alert = ({ message, color }: AlertProps) => {
  const [visible, setVisible] = useState(true);

  // 3초 뒤에 alert창 사라짐
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed z-[9999] flex w-full justify-center">
      <div className={`px-4 py-4 mt-20 flex justify-start items-center space-x-2 min-w-[300px] border border-${color}-200 rounded-lg bg-${color}-100`}>
        <AlertCircle className={`w-4 h-4 text-${color}-300`} />
        <span className={`font-medium text-sm text-${color}-300`}>{message}</span>
      </div>
    </div>
  );
}

export default Alert;