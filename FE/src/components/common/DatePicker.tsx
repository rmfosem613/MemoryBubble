import React, { useState } from 'react';

interface DatePickerProps {
  onChange?: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Generate days for the current month
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Create an array for all days in the month
    const days = [];
    
    // Add empty cells for days before the start of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };
  
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];
  
  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };
  
  const handleDateClick = (day: number | null) => {
    if (day) {
      const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      setSelectedDate(newDate);
      setShowCalendar(false);
      
      if (onChange) {
        onChange(newDate);
      }
    }
  };
  
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };
  
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1)}-${String(date.getDate())}`;
  };
  
  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full p-2 rounded-lg border border-gray-300 text-sm cursor-pointer"
        value={formatDate(selectedDate)}
        onClick={toggleCalendar}
        readOnly
      />
      
      {showCalendar && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <div className="flex justify-between items-center p-2 border-b">
            <button 
              className="p-1 hover:bg-gray-100 rounded" 
              onClick={handlePrevMonth}
            >
              &lt;
            </button>
            <div className="font-medium text-sm">
              {selectedDate.getFullYear()}년 {months[selectedDate.getMonth()]}
            </div>
            <button 
              className="p-1 hover:bg-gray-100 rounded" 
              onClick={handleNextMonth}
            >
              &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-7 text-center">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="p-1 text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {generateCalendar().map((day, index) => (
              <div 
                key={index}
                className={`p-1 text-sm cursor-pointer ${
                  day === null ? 'invisible' : 'hover:bg-gray-100'
                } ${
                  day === selectedDate.getDate() ? 'bg-blue-100 font-bold' : ''
                }`}
                onClick={() => handleDateClick(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;