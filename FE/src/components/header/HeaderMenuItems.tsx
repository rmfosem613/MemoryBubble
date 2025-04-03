import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import useHeaderMenuItems from '@/hooks/useHeaderMenuItems';

interface HeaderMenuItemsProps {
  className?: string;
}

const HeaderMenuItems = ({ className = '' }: HeaderMenuItemsProps) => {
  const { isUnread } = useHeaderMenuItems();

  const menuItemStyle =
    'px-2 py-1.5 rounded-full hover:bg-black/5 transition-colors duration-300 text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg font-p-500';

  return (
    <div className={className}>
      <Link to="/font" className={menuItemStyle}>
        나의 손글씨
      </Link>
      <Link to="/" className={menuItemStyle}>
        추억 갤러리
      </Link>
      <Link to="/calendar" className={menuItemStyle}>
        방울 캘린더
      </Link>
      <Link
        to="/storage"
        className="relative px-2 py-1 rounded-full hover:bg-black/5 transition-colors duration-300 group">
        <Mail className="size-7 lg:size-[30px]" strokeWidth={1.3} />
        {isUnread && (
          <>
            <span className="absolute top-[6px] right-[7px] h-2 w-2 bg-red-500 rounded-full"></span>
            <span className="invisible group-hover:visible absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-700 text-white text-xs rounded whitespace-nowrap">
              읽지 않은 편지가 있습니다
            </span>
          </>
        )}
      </Link>
    </div>
  );
};

export default HeaderMenuItems;
