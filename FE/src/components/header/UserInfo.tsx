import React, { useState, useRef, useEffect } from 'react';
import { Copy, RotateCcw, Edit2, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import useUserApi from '@/apis/useUserApi';
import useModal from '@/hooks/useModal';
import GroupEditModal from './GroupEditModal';
import ProfileEditModal from './ProfileEditModal';

const UserInfo = () => {
  const { user, family, resetUser } = useUserStore();
  const { getFamilyInviteCode, logout } = useUserApi();
  const navigate = useNavigate();

  // 드롭다운 관련 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('A43DG650');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 모달 관련 상태
  const groupNameModal = useModal();
  const profileEditModal = useModal();

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 모달이 열려있는 경우에는 드롭다운을 닫지 않음
      if (groupNameModal.isOpen || profileEditModal.isOpen) {
        return;
      }

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setShowInviteCode(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [groupNameModal.isOpen, profileEditModal.isOpen]);

  // 초대 코드 복사
  const copyInviteCode = () => {
    navigator.clipboard
      .writeText(inviteCode)
      .then(() => {
        console.log('초대 코드 복사 성공');
      })
      .catch((err) => {
        console.log('초대 코드 복사 실패');
      });
  };

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      setShowInviteCode(false);
    }

    setIsDropdownOpen(!isDropdownOpen);
  };

  // 초대 코드 보기 버튼 클릭 시 호출
  const handleShowInviteCode = async () => {
    try {
      if (user.familyId) {
        const response = await getFamilyInviteCode(user.familyId);
        if (response.status === 200) {
          setInviteCode(response.data.code);
          setShowInviteCode(true);
        }
      }
    } catch (error) {
      console.error('초대 코드 가져오기 실패:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      const response = await logout();
      if (response.status === 200) {
        // 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // 유저 스토어 상태 초기화
        resetUser();

        // 로그인 페이지로 이동
        navigate('/kakao');
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 오류가 발생해도 토큰 삭제 및 페이지 이동 처리
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      resetUser();
      navigate('/kakao');
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <div
          onClick={toggleDropdown}
          className="relative h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-full overflow-hidden flex justify-center items-center bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
          <img
            src={user.profileUrl}
            alt="프로필 이미지"
            className="h-full w-full object-cover"
          />
        </div>

        {/* 드롭다운 메뉴 */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 p-2 w-64 rounded-lg border shadow-md bg-white z-45">
            {/*  그룹 */}
            <div className="p-3 flex flex-col items-center space-y-2 bg-blue-50">
              {/* 그룹 이미지 */}
              <img
                src={family.thumbnailUrl}
                alt="그룹 이미지"
                className="h-24 w-24 rounded-full object-cover"
              />
              {/* 그룹 이름 */}
              <div className="flex items-center space-x-2">
                <div className="text-h5-lg font-p-700">{family.familyName}</div>
                <div
                  className="text-gray-500 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    groupNameModal.open();
                  }}>
                  <Edit2 size={16} />
                </div>
              </div>

              {/* 초대 코드 */}
              {!showInviteCode ? (
                <div
                  className="p-2 w-full border border-gray-400 rounded-md text-center text-p-lg hover:bg-white/50 transition-colors cursor-pointer"
                  onClick={handleShowInviteCode}>
                  초대 코드 보기
                </div>
              ) : (
                <div className="p-2 w-full border border-gray-300 rounded-md text-p-lg flex justify-between items-center">
                  <p>{inviteCode}</p>
                  <div className="flex space-x-2">
                    <div
                      className="text-gray-500 hover:text-gray-700 cursor-pointer"
                      onClick={copyInviteCode}>
                      <Copy size={16} />
                    </div>
                    <div className="text-gray-500 hover:text-gray-700 cursor-pointer">
                      <RotateCcw size={16} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 그룹 목록 */}
            <div className="max-h-60 overflow-y-auto mb-2">
              {/* 현재 사용자 */}
              <div className="flex items-center space-x-3 p-3 border-b border-gray-200">
                <img
                  src={user.profileUrl}
                  alt="프로필 이미지"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm">{user.name}</p>
                    <div
                      className="text-gray-500 hover:text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        profileEditModal.open();
                      }}>
                      <Settings size={18} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{user.birth}</p>
                  <p className="text-xs text-gray-500">{user.phoneNumber}</p>
                </div>
              </div>

              {/* 그룹 멤버 */}
              {family.familyMembers.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 border-b border-gray-200">
                  <img
                    src={member.profileUrl}
                    alt={`프로필 이미지`}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.birth}</p>
                    <p className="text-xs text-gray-500">
                      {member.phoneNumber}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 로그아웃 */}
            <button
              className="p-2 w-full flex items-center space-x-2 text-sm text-red-600 hover:text-red-700"
              onClick={handleLogout}>
              <LogOut size={18} />
              <p>로그아웃</p>
            </button>
          </div>
        )}
      </div>

      {/* 그룹명 수정 모달 */}
      <GroupEditModal
        isOpen={groupNameModal.isOpen}
        onClose={groupNameModal.close}
      />

      {/* 프로필 수정 모달 */}
      <ProfileEditModal
        isOpen={profileEditModal.isOpen}
        onClose={profileEditModal.close}
      />
    </>
  );
};

export default UserInfo;
