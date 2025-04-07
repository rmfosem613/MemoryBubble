import React, { useRef, useEffect } from 'react';
import { Copy, X, Edit2, Settings, LogOut } from 'lucide-react';
import useUserStore from '@/stores/useUserStore';
import useModal from '@/hooks/useModal';
import useUserInfo from '@/hooks/useUserInfo';
import GroupEditModal from './GroupEditModal';
import ProfileEditModal from './ProfileEditModal';
import Alert from '../common/Alert';

const UserInfo = () => {
  const { user, family } = useUserStore();
  const {
    isDropdownOpen,
    setIsDropdownOpen,
    toggleDropdown,
    showInviteCode,
    setShowInviteCode,
    inviteCode,
    handleShowInviteCode,
    copyInviteCode,
    handleLogout,
    customAlert,
  } = useUserInfo();

  // 모달 관련 상태
  const groupNameModal = useModal();
  const profileEditModal = useModal();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  }, [
    groupNameModal.isOpen,
    profileEditModal.isOpen,
    setIsDropdownOpen,
    setShowInviteCode,
  ]);

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        {/* 커스텀 알림 렌더링 */}
        {customAlert.isVisible && (
          <Alert message={customAlert.message} color={customAlert.color} />
        )}
        {/*  헤더 - 프로필 사진 */}
        <img
          src={user.profileUrl+"&w=80&h=80"}
          alt="프로필 이미지"
          className="h-10 w-10 md:h-11 md:w-11 rounded-full object-cover bg-white cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown();
          }}
        />

        {/* 드롭다운 메뉴 */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-1.5 p-2 w-64 rounded-lg shadow-md bg-white z-30">
            {/* ----- 그룹 ----- */}
            <div className="p-3 flex flex-col items-center space-y-2 bg-blue-50">
              {/* 그룹 이미지 */}
              <img
                src={family.thumbnailUrl+"&w=180&h=180"}
                alt="그룹 이미지"
                className="h-24 w-24 rounded-full object-cover bg-white"
              />
              {/* 그룹 이름 */}
              <div className="flex items-center space-x-1">
                <div className="text-h5-lg font-p-700">{family.familyName}</div>
                <div
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
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
                  className="p-2 w-full border border-gray-400 rounded-md text-center text-p-lg hover:bg-white/50 transition-colors duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowInviteCode();
                  }}>
                  초대 코드 보기
                </div>
              ) : (
                <div className="py-2 px-3 w-full border border-gray-300 rounded-md text-p-lg flex justify-between items-center">
                  <p>{inviteCode}</p>
                  <div className="flex space-x-2">
                    <div
                      className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyInviteCode();
                      }}>
                      <Copy size={16} />
                    </div>
                    <div
                      className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowInviteCode(false);
                      }}>
                      <X size={16} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ----- 그룹 목록 ----- */}
            <div className="max-h-60 overflow-y-auto mb-3">
              {/* 현재 사용자 */}
              <div className="flex items-center space-x-3 p-3 border-b border-gray-200">
                <img
                  src={user.profileUrl+"&w=80&h=80"}
                  alt="프로필 이미지"
                  className="h-11 w-11 rounded-full object-cover bg-white"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm">{user.name}</p>
                    <div
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        profileEditModal.open();
                      }}>
                      <Settings size={20} />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{user.birth}</p>
                  <p className="text-xs text-gray-500">{user.phoneNumber}</p>
                </div>
              </div>
              {/* 그룹 멤버 */}
              {family.familyMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center space-x-3 p-3 border-b border-gray-200">
                  <img
                    src={member.profileUrl}
                    alt="프로필 이미지"
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
              className="px-2 pb-1 w-full flex items-center space-x-2 text-h-logo-sm text-red-600 hover:text-red-700 transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}>
              <LogOut size={16} />
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
