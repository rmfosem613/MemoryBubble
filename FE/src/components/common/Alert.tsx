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

  const getColorClasses = () => {
    if (color === "red") {
      return {
        border: "border-red-200",
        bg: "bg-red-100",
        text: "text-red-200"
      };
    } else if (color === "green") {
      return {
        border: "border-green-200",
        bg: "bg-green-100",
        text: "text-green-200"
      };
    } else {
      return {
        border: "border-gray-200",
        bg: "bg-gray-100",
        text: "text-gray-700"
      };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="fixed top-0 w-full flex justify-center items-center z-[9999] pointer-events-none">
      <div className={`px-4 py-4 mt-20 flex justify-start items-center space-x-2 min-w-[300px] rounded-lg border border-1 ${colorClasses.border} ${colorClasses.bg}`}>
        <AlertCircle className={`w-4 h-4 ${colorClasses.text}`} />
        <span className={`font-medium text-sm ${colorClasses.text}`}>{message}</span>
      </div>
    </div>
  );
};

export default Alert;