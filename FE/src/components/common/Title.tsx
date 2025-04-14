import React from 'react';

interface TitleProps {
  text: string;
}

function Title({ text }: TitleProps) {
  return (
    <div className="relative w-[290px] left-5 text-h1-lg font-p-700 pt-20">
      {text}
      <div className="absolute -z-10 top-[85px] -left-4 w-14 h-14 bg-blue-400 rounded-full opacity-30 "></div>
      <div className="absolute -z-10 top-[80px] -left-7 w-4 h-4 bg-blue-400 rounded-full opacity-50"></div>
    </div>
  );
}

export default Title;
