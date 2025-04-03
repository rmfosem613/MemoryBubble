import { useEffect, useState } from 'react';
import { useLetterStore } from '@/stores/useLetterStore';
import LetterContainer from '@/components/letter/common/LetterContainer';
import SeasonalDecorations from '@/components/letter/common/SeasonTemplate';
import { useUserApi } from '@/apis/useUserApi';
import useUserStore from '@/stores/useUserStore';

interface TextLetterContentProps {
  content: string;
  onContentChange: (content: string) => void;
}

function TextLetterContent({
  content,
  onContentChange,
}: TextLetterContentProps) {
  const { selectedColor, selectedMember } = useLetterStore();
  const [senderName, setSenderName] = useState<string>('');
  const { fetchUserProfile } = useUserApi();
  const { user } = useUserStore();

  // 현재 사용자 정보 조회
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // 사용자 프로필 정보 조회
        const profileResponse = await fetchUserProfile(user.userId);
        const userProfile = profileResponse.data;

        // 보내는 사람 이름 설정
        if (userProfile.name) {
          setSenderName(userProfile.name);
        }
      } catch (error) {
        console.error('사용자 프로필 조회 실패:', error);
      }
    };

    loadUserProfile();
  }, [fetchUserProfile]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value);
  };

  return (
    <LetterContainer>
      {/* 편지지 데코레이션: z-0 */}
      <SeasonalDecorations selectedColor={selectedColor} />

      <div className="relative z-10 h-full flex flex-col">
        <div>
          <div className="flex space-x-3 relative z-20 items-end mb-[9px]">
            <p className="text-h3-lg font-p-700">TO.</p>
            <p className="pb-[2px] text-h4-lg font-p-700">
              {selectedMember ? selectedMember.label : ''}
            </p>
          </div>
        </div>

        {/* 편지지 줄 7개 추가 */}
        {[...Array(7)].map((_, index) => (
          <div key={index}>
            <hr className="border-t border-gray-400 my-[26.7px]" />
          </div>
        ))}

        <div>
          <div className="flex space-x-3 relative z-20 items-end mt-[-31px] justify-end">
            <p className="text-h3-lg font-p-700">From.</p>
            <p className="pb-[2px] text-h4-lg font-p-700">
              {senderName ? `${senderName}` : '보내는 사람이 없습니다.'}
            </p>
          </div>
        </div>
      </div>

      {/* 편지지 내용 입력: z-30 */}
      <div className="absolute top-[-10px] mt-[60px] z-30 flex flex-col w-full pr-[40px]">
        <textarea
          className="resize-none h-[370px]"
          style={{
            backgroundColor: 'transparent',
            lineHeight: '340%',
            outline: 'none',
          }}
          rows={9}
          value={content}
          onChange={handleTextChange}
          placeholder="여기에 편지 내용을 입력하세요"
        />
      </div>
    </LetterContainer>
  );
}

export default TextLetterContent;
