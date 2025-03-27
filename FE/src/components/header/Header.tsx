import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  UserRound,
  LogOut,
  Settings,
  Image,
  Copy,
  RotateCcw,
  Edit2,
} from 'lucide-react';
import useUserStore, { User, Family } from '@/stores/useUserStore';
// 모달
import useModal from '@/hooks/useModal';
import GroupNameEditModal from './GroupNameEditModal';
import ProfileEditModal from './ProfileEditModal';

const Header = () => {
  // 스토어 관련 상태
  const { user, family, isUnread } = useUserStore();

  // Header 관련 상태
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

  return (
    <>
      <header className="fixed top-0 h-[65px] w-full bg-white/70 backdrop-blur-sm flex items-center z-[45]">
        <div className="container flex justify-between items-center">
          <Link to="/" className="">
            <img
              src="/logo-3.svg"
              alt="추억방울"
              className="h-8 md:h-9 lg:h-10"
            />
          </Link>

          {/* 그룹 가입 + 사용자 정보 등록 확인 */}
          {user.familyId && user.birth && (
            <div className="flex items-center space-x-3">
              <Link
                to="/font"
                className="p-1 rounded-full hover:bg-black/10 transition-colors text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg font-p-500">
                나의 손글씨
              </Link>

              <Link
                to="/"
                className="p-1 rounded-full hover:bg-black/10 transition-colors text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg font-p-500">
                추억 갤러리
              </Link>

              <Link
                to="/calendar"
                className="p-1 rounded-full hover:bg-black/10 transition-colors text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg font-p-500">
                방울 캘린더
              </Link>

              <Link
                to="/storage"
                className="relative p-1 rounded-full hover:bg-black/10 transition-colors">
                <Mail
                  className="w-6 h-6 md:w-[26px] md:h-[26px] lg:w-7 lg:h-7"
                  strokeWidth={1.3}
                />
                {isUnread && (
                  <span className="absolute top-[5px] right-[2px]  h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                )}
              </Link>

              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={toggleDropdown}
                  className="relative h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-full overflow-hidden flex justify-center items-center bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
                  <img
                    src={family.thumbnailUrl}
                    alt="그룹 프로필 이미지"
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
                        <div className="text-h5-lg font-p-700">
                          {family.familyName}
                        </div>
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
                          onClick={() => setShowInviteCode(true)}>
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
                          <p className="text-xs text-gray-500">
                            {user.phoneNumber}
                          </p>
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
                            <p className="text-xs text-gray-500">
                              {member.birth}
                            </p>
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
                      onClick={() => {}}>
                      <LogOut size={18} />
                      <p>로그아웃</p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 그룹명 수정 모달 */}
      <GroupNameEditModal
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

export default Header;
