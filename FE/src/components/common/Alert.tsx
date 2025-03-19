import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

interface AlertProps {
    message: string;
    onClose: () => void;
}

const Alert = ({ message, onClose }: AlertProps) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    return (
        <div className='absolute rounded-[8px] z-100 bg-red-200 px-[12px] py-[16px] border-t border-red-300 flex justify-center space-x-1'>
            <AlertCircle className='w-[16px] h-[16px]' color="red" />
            {/* <span className=''>{message}</span> */}
            <span className=''>알람창입니다.</span>
        </div>
    );
}

export default Alert;