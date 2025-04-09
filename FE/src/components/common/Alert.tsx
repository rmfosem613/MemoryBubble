import { useEffect, useState } from "react";
import { AlertCircle, Check, X } from "lucide-react";

interface AlertProps {
  message: string;
  color: string;
  confirmButton?: () => void;
  cancelButton?: () => void;
  showButtons?: boolean;
}

// color 예시 : green, red, gray, blue
const Alert = ({ message, color, confirmButton, cancelButton, showButtons = false }: AlertProps) => {
  const [visible, setVisible] = useState(true);

  // 버튼이 없는 경우에만 자동으로 사라짐
  useEffect(() => {
    if (!showButtons) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showButtons]);

  if (!visible) return null;

  const getColorClasses = () => {
    if (color === "red") {
      return {
        border: "border-red-200",
        bg: "bg-red-100",
        text: "text-red-300"
      };
    } else if (color === "green") {
      return {
        border: "border-green-200",
        bg: "bg-green-100",
        text: "text-green-300"
      };
    } else if (color === "blue") {
      return {
        border: "border-blue-800",
        bg: "bg-blue-700",
        text: "text-blue-900"
      };
    }
    else {
      return {
        border: "border-gray-200",
        bg: "bg-gray-100",
        text: "text-gray-700"
      };
    }
  };

  const colorClasses = getColorClasses();

  // 확인 버튼 클릭 핸들러
  const handleConfirm = () => {
    if (confirmButton) confirmButton();
    setVisible(false);
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    if (cancelButton) cancelButton();
    setVisible(false);
  };

  return (
    <div className="fixed left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-auto mt-[64px]">
      <div className={`px-4 py-4 flex flex-col min-w-[300px] rounded-lg border border-1 ${colorClasses.border} ${colorClasses.bg}`}>
        <div className="flex justify-between items-center space-x-6">
          <div className="flex space-x-2 items-center">
            <AlertCircle className={`w-4 h-4 ${colorClasses.text}`} />
            <span className={`font-medium text-sm ${colorClasses.text}`}>{message}</span>
          </div>
          {showButtons && (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className={`flex items-center text-red-300`}>
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
              {/* <button
                onClick={handleConfirm}
                className={`flex items-center p-1  text-green-200`}>
                <Check className="w-5 h-5" strokeWidth={3} />
              </button> */}
            </div>
          )}
        </div>


      </div>
    </div >
  );
};

export default Alert;