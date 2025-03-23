import React, { useEffect, useRef, useState } from 'react';
import { LetterData } from '@/types/Letter';
import { Headset, CirclePause, CirclePlay } from 'lucide-react';

// Letter.ts에 contents 필드 추가를 가정
// 실제 프로젝트에서는 Letter.ts 파일에 해당 필드를 추가해야 합니다
declare module '@/types/Letter' {
  interface LetterData {
    contents?: string;
  }
}

// 이미지 import
// summer
import turtle from '@/assets/letter/summer-turtle.svg';
import seashell from '@/assets/letter/summer-seashell.svg';
import cassetteSpring from '@/assets/letter/cassetteSpring.svg'

// spring
import cherry from '@/assets/letter/spring-cherry.svg';
import sweet from '@/assets/letter/sping-sweet.svg';
import cassetteSummer from '@/assets/letter/cassetteSummer.svg'


// autumn
import plant from '@/assets/letter/autumn-plant.svg';
import tree from '@/assets/letter/autumn-tree.svg';
import cassetteAutumn from '@/assets/letter/cassetteAutumn.svg'


//winter
import snow from '@/assets/letter/winter-snow.svg';
import snowman from '@/assets/letter/winter-snowman.svg';
import cassetteWinter from '@/assets/letter/cassetteWinter.svg'


interface LetterAnimationProps {
  letter: LetterData | null;
  onClose: () => void;
  isOpen: boolean;
}

const LetterAnimation: React.FC<LetterAnimationProps> = ({ letter, onClose, isOpen }) => {
  const unsubscribeRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isOpen && letter) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current.classList.add('show-game');
        unsubscribeRef.current.classList.remove('hide-game');
      }
    } else {
      if (unsubscribeRef.current) {
        unsubscribeRef.current.classList.add('hide-game');
        unsubscribeRef.current.classList.remove('show-game');

        const timer = setTimeout(() => {
          if (unsubscribeRef.current) {
            unsubscribeRef.current.classList.remove('hide-game');
          }
        }, 800);

        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, letter]);

  if (!letter) return null;

  // 계절별 색상 변수 설정
  const getLetterColors = (color: string) => {
    switch (color) {
      case 'spring':
        return {
          mail: '#FFBFCD',
          mailTriangle: '#FFB3C4',
          mailBackground: '#FFA5B8',
          mailShadow: '#FFE2EA',
          waveColor: 'rgba(255, 191, 205, 0.5)' // Spring wave color
        };
      case 'summer':
        return {
          mail: '#76C1DE',
          mailTriangle: '#68B4D6',
          mailBackground: '#5BA9CE',
          mailShadow: '#D0EAF5',
          waveColor: 'rgba(118, 193, 222, 0.5)' // Summer wave color
        };
      case 'autumn':
        return {
          mail: '#F8C37F',
          mailTriangle: '#F6B96F',
          mailBackground: '#F5AF5F',
          mailShadow: '#FCE8D0',
          waveColor: 'rgba(248, 195, 127, 0.5)' // Autumn wave color
        };
      case 'winter':
      default:
        return {
          mail: '#97A1D6',
          mailTriangle: '#8A95CF',
          mailBackground: '#7C88C9',
          mailShadow: '#DCE0F2',
          waveColor: 'rgba(151, 161, 214, 0.5)' // Winter wave color
        };
    }
  };

  const colors = getLetterColors(letter.color);

  // 편지 타입에 따른 크기 설정
  const bodyStyle = letter.type === 'cassette' 
    ? { width: '650px', height: '650px' } 
    : { width: '780px', height: '900px' };

  // 웨이브 애니메이션을 위한 스타일
  const waveAnimationStyle = `
    @keyframes drift {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .animate-drift {
      animation: drift 25s infinite linear;
    }
    
    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    .animate-spin-slow {
      animation: spin-slow 4s linear infinite;
    }
  `;

  // Wave Animation Component
  const WaveAnimation = () => (
    <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden z-0">
      {/* 첫 번째 파도 */}
      <div 
        className="absolute bottom-[95%] right-0 w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] opacity-60 animate-drift"
        style={{ backgroundColor: colors.waveColor }}
      ></div>
      <div 
        className="absolute bottom-[100%] right-0 w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] animate-drift"
        style={{ backgroundColor: colors.waveColor }}
      ></div>

      {/* 두 번째 파도 */}
      <div 
        className="absolute top-[40%] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] opacity-80 animate-drift"
        style={{ backgroundColor: colors.waveColor }}
      ></div>
      <div 
        className="absolute top-[45%] w-[1500px] h-[1500px] -ml-[150px] -mb-[250px] origin-[50%_48%] rounded-[43%] animate-drift"
        style={{ backgroundColor: colors.waveColor }}
      ></div>
    </div>
  );

  return (
    <>
      <style>{waveAnimationStyle}</style>
      <div
        id="unsubscribe"
        ref={unsubscribeRef}
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          '--mail': colors.mail,
          '--mail-triangle': colors.mailTriangle,
          '--mail-background': colors.mailBackground,
          '--mail-shadow': colors.mailShadow
        } as React.CSSProperties}
      >
        <div className="letter">
          <div className="shadow"></div>
          <div className="background"></div>
          <div 
            className="body"
            style={bodyStyle}
          >
            {/* Wave Animation only for cassette type */}
            {letter.type === 'cassette' && <WaveAnimation />}
            
            <div className="headline">
              <div className="close" onClick={onClose}>
                <svg viewBox="0 0 24 24">
                  <path
                    d="M19.7,4.3c-0.4-0.4-1-0.4-1.4,0L12,10.6L5.7,4.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l6.3,6.3l-6.3,6.3 c-0.4,0.4-0.4,1,0,1.4C4.5,19.9,4.7,20,5,20s0.5-0.1,0.7-0.3l6.3-6.3l6.3,6.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L13.4,12l6.3-6.3C20.1,5.3,20.1,4.7,19.7,4.3z">
                  </path>
                </svg>
              </div>
            </div>
            <div className="letter-content p-6 overflow-auto h-full w-full">
              {letter.type === 'letter' ? (
                <div className="relative h-full flex flex-col">
                  {/* 계절 테마 장식 */}
                  <div className="absolute inset-0 z-0">
                    {(() => {
                      // spring
                      if (letter.color === 'spring') {
                        return (
                          <>
                            <img src={cherry} className="absolute top-0 right-0 z-0 w-[190px]" alt="봄 장식" />
                            <img src={sweet} className="absolute bottom-0 left-0 z-0 w-[200px]" alt="봄 장식" />
                          </>
                        );
                        // summer
                      } else if (letter.color === 'summer') {
                        return (
                          <>
                            <img src={seashell} className="absolute top-[0px] left-[0px] z-0 w-[150px]" alt="여름 장식" />
                            <img src={turtle} className="absolute bottom-[0px] right-[0px] z-0 w-[280px]" alt="여름 장식" />
                          </>
                        );
                        // autumn
                      } else if (letter.color === 'autumn') {
                        return (
                          <>
                            <img src={plant} className="absolute bottom-0 left-0 z-0 w-[210px]" alt="가을 장식" />
                            <img src={tree} className="absolute bottom-[0px] right-[-10px] z-0 w-[350px]" alt="가을 장식" />
                          </>
                        );
                        // winter
                      } else {
                        return (
                          <>
                            <img src={snow} className="absolute bottom-0 left-[-90px] z-0 w-[380px]" alt="겨울 장식" />
                            <img src={snowman} className="absolute bottom-0 right-[-15px] z-0 w-[290px]" alt="겨울 장식" />
                          </>
                        );
                      }
                    })()}
                  </div>

                  {/* 편지 내용 */}
                  <div className="relative z-10 h-full flex flex-col">
                    <div>
                      <div className="flex space-x-3 relative z-20 items-end mb-[15px]">
                        <p className="text-2xl font-bold">TO.</p>
                        <p className="pb-[2px] text-xl font-semibold">{letter.name}</p>
                      </div>
                    </div>

                    {/* 편지 내용 표시 */}
                    <div className="flex-1 relative z-20 mb-12">
                      {letter.contents ? (
                        <div
                          className="text-lg leading-loose text-gray-700 overflow-y-auto h-full"
                          dangerouslySetInnerHTML={{ __html: letter.contents }}
                        />
                      ) : (
                        <div className="flex flex-col h-full">
                          {/* 내용이 없을 경우 편지지 줄만 표시 */}
                          {[...Array(9)].map((_, index) => (
                            <div key={index}>
                              <hr className="border-t border-gray-400 my-[35px]" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex space-x-3 relative z-20 items-end justify-end">
                        <p className="text-2xl font-bold">From.</p>
                        <p className="pb-[2px] text-xl font-semibold">보낸 사람</p>
                      </div>
                    </div>
                  </div>

                  {/* 날짜 표시 */}
                  <div className="absolute bottom-4 right-4 text-base text-gray-500">
                    <p>{letter.date}</p>
                  </div>
                </div>
              ) : (
                // 카세트 타입인 경우
                <div className="flex flex-col items-center justify-center h-full">
                  {/* 카세트 장식 */}
                  <div className="absolute inset-0 z-10">
                    {(() => {
                      if (letter.color === 'spring') {
                        return (
                          <img 
                            src={cassetteSpring} 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[550px]" 
                            alt="봄 카세트" 
                          />
                        );
                      } else if (letter.color === 'summer') {
                        return (
                          <img 
                            src={cassetteSummer} 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[550px]" 
                            alt="여름 카세트" 
                          />
                        );
                      } else if (letter.color === 'autumn') {
                        return (
                          <img 
                            src={cassetteAutumn} 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[550px]" 
                            alt="가을 카세트" 
                          />
                        );
                      } else {
                        return (
                          <img 
                            src={cassetteWinter} 
                            className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[550px]" 
                            alt="겨울 카세트" 
                          />
                        );
                      }
                    })()}
                  </div>

                  {/* 카세트 재생 컨트롤 */}
                  <div className="absolute bottom-10 z-20 w-full flex justify-center">
                    <div className="bg-white border border-gray-300 rounded-[8px] px-[50px] py-[20px] flex items-center gap-[60px]">
                      <button 
                        className="hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isPlaying) {
                            setIsPlaying(true);
                            // 재생 시작 로직 (실제 구현 필요)
                          }
                        }}
                        disabled={isPlaying}
                      >
                        <Headset 
                          color={isPlaying ? "#9D9D9D" : "#3E404C"} 
                          width="28" 
                          height="28" 
                          className={isPlaying ? "opacity-50" : ""}
                        />
                      </button>
                      {isPlaying ? (
                        <button 
                          className="hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPlaying(false);
                            // 재생 중지 로직 (실제 구현 필요)
                          }}
                        >
                          <CirclePause color="#3E404C" width="28" height="28" />
                        </button>
                      ) : (
                        <button 
                          className="hover:bg-gray-100 p-2 rounded-full transition-colors flex items-center justify-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsPlaying(true);
                            // 재생 시작 로직 (실제 구현 필요)
                          }}
                        >
                          <CirclePlay color="#3E404C" width="28" height="28" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LetterAnimation;