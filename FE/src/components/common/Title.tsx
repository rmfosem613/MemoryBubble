import React from 'react';

interface TitleProps {
  text: string;
}

function Title({ text }: TitleProps) {
  return (
    <div className="container">
      <div className="relative w-fit text-h1-sm font-p-700 pt-20 md:text-h1-md lg:text-h1-lg">
        {text}
        <div className="absolute -z-10 top-20 -left-4 w-10 h-10 bg-blue-400 rounded-full opacity-30 md:w-12 md:h-12 lg:w-14 lg:h-14"></div>
        <div className="absolute -z-10 top-20 -left-8 w-2 h-2 bg-blue-400 rounded-full opacity-50 md:w-3 md:h-3 lg:w-4 lg:h-4"></div>
      </div>
    </div>
  );
}

export default Title;
