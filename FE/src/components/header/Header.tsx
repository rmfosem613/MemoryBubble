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
  Camera,
  Calendar,
} from 'lucide-react';
import Modal from '../common/Modal/Modal';
import useModal from '@/hooks/useModal';

// 임시 데이터
import tempUser from './tempUser.json';
import tempFamily from './tempFamily.json';

interface User {
  user_id: number;
  name: string;
  profileUrl: string;
  birth: string;
  phoneNumber: string;
  gender: string;
  familyId: number;
}

interface Family {
  familyName: string;
  thumbnailUrl: string;
  familyMembers: FamilyMember[];
}

interface FamilyMember {
  name: string;
  profileUrl: string;
  birth: string;
  phoneNumber: string;
}

const Header = () => {
  const [user, setUser] = useState<User>(tempUser);
  const [family, setFamily] = useState<Family>(tempFamily);
  const [showLetter] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('A43DG650');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const GroupNameEditModal = useModal();
  const [newGroupName, setNewGroupName] = useState(family.familyName);

  const ProfileEditModal = useModal();
  const [updatedUser, setUpdatedUser] = useState<User>(user);
  const [phonePrefix, setPhonePrefix] = useState('010');
  const [phoneMiddle, setPhoneMiddle] = useState('');
  const [phoneSuffix, setPhoneSuffix] = useState('');

  const handleOpenProfileModal = () => {
    const parts = user.phoneNumber.split('-');
    setPhonePrefix(parts[0] || '010');
    setPhoneMiddle(parts[1] || '');
    setPhoneSuffix(parts[2] || '');
    setUpdatedUser(user);
    ProfileEditModal.open();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string,
  ) => {
    const { value } = e.target;

    // 필드에 따라 다른 상태 업데이트
    if (field === 'phonePrefix') {
      setPhonePrefix(value);
    } else if (field === 'phoneMiddle') {
      setPhoneMiddle(value);
    } else if (field === 'phoneSuffix') {
      setPhoneSuffix(value);
    } else {
      // 일반 필드는 updatedUser 객체에 직접 업데이트
      setUpdatedUser((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // 프로필 업데이트
  const handleProfileUpdate = () => {
    const formattedPhoneNumber = `${phonePrefix}-${phoneMiddle}-${phoneSuffix}`;

    setUser({
      ...updatedUser,
      phoneNumber: formattedPhoneNumber,
    });

    ProfileEditModal.close();
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
  }, []);

  // 초대 코드 복사 함수
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
          <Link
            to="/"
            className="text-h-logo-sm md:text-h-logo-md lg:text-h-logo-lg font-p-800">
            추억방울
          </Link>

          {user.familyId && (
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
                {showLetter && (
                  <span className="absolute top-[5px] right-[2px]  h-2.5 w-2.5 bg-red-500 rounded-full"></span>
                )}
              </Link>

              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={toggleDropdown}
                  className="relative h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-full overflow-hidden flex justify-center items-center bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity">
                  {family.thumbnailUrl ? (
                    <img
                      src={family.thumbnailUrl}
                      alt="그룹 프로필 이미지"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound
                      className="w-6 h-6 md:w-[26px] md:h-[26px] lg:w-7 lg:h-7"
                      strokeWidth={1.3}
                    />
                  )}
                </div>

                {/* 드롭다운 메뉴 */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 p-2 w-64 rounded-lg border shadow-md bg-white z-45">
                    {/*  그룹 */}
                    <div className="p-3 flex flex-col items-center space-y-2 bg-blue-50">
                      {/* 그룹 이미지 */}
                      {family.thumbnailUrl ? (
                        <img
                          src={family.thumbnailUrl}
                          alt="그룹 이미지"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full border-2 border-blue-300 text-blue-300 flex items-center justify-center">
                          <Image size={40} />
                        </div>
                      )}

                      {/* 그룹 이름 */}
                      <div className="flex items-center space-x-2">
                        <div className="text-h5-lg font-p-700">
                          {family.familyName}
                        </div>
                        <div
                          className="text-gray-500 hover:text-gray-700"
                          onClick={GroupNameEditModal.open}>
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
                        {user.profileUrl ? (
                          <img
                            src={user.profileUrl}
                            alt="프로필 이미지"
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-11 w-11 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserRound />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="text-sm">{user.name}</p>
                            <div
                              className="text-gray-500 hover:text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenProfileModal();
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
                          {member.profileUrl ? (
                            <img
                              src={member.profileUrl}
                              alt={`${member.name} 프로필 이미지`}
                              className="h-11 w-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserRound />
                            </div>
                          )}
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
      <Modal
        isOpen={GroupNameEditModal.isOpen}
        onClose={GroupNameEditModal.close}
        title="그룹명 수정"
        confirmButtonText="저장하기"
        cancelButtonText="취소하기"
        onConfirm={() => {
          // axios 요청 추가
          setFamily({
            ...family,
            familyName: newGroupName,
          });
        }}>
        <div className="mb-3">
          <p className="pb-2">수정할 그룹명을 입력해주세요.</p>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="그룹명을 입력하세요"
          />
        </div>
      </Modal>
      <Modal
        isOpen={ProfileEditModal.isOpen}
        onClose={ProfileEditModal.close}
        title="프로필 수정"
        confirmButtonText="저장하기"
        cancelButtonText="취소하기"
        onConfirm={handleProfileUpdate}>
        <div className="w-full p-2 flex flex-col justify-center space-y-4">
          {/* 프로필 이미지 */}
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={updatedUser?.profileUrl}
              alt="프로필 이미지"
              className="w-24 h-24 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm cursor-pointer">
              <Camera />
            </div>
          </div>

          {/* 이름 입력 */}
          <div className="flex items-center">
            <label className="text-subtitle-1-lg font-p-500 w-24">
              이름(별명)
            </label>
            <div className="flex-1">
              <input
                type="text"
                name="name"
                value={updatedUser?.name || ''}
                onChange={(e) => handleInputChange(e, 'name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* 생년월일 입력 */}
          <div className="flex items-center">
            <label className="text-subtitle-1-lg font-p-500 w-24">
              생년월일
            </label>
            <div className="relative flex-1">
              <input
                type="text"
                name="birth"
                value={updatedUser?.birth || ''}
                onChange={(e) => handleInputChange(e, 'birth')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Calendar />
              </span>
            </div>
          </div>

          {/* 전화번호 입력 */}
          <div className="flex items-center">
            <label className="text-subtitle-1-lg font-p-500 w-24">
              전화번호
            </label>
            <div className="flex items-center space-x-2 flex-1">
              <select
                name="phonePrefix"
                value={phonePrefix}
                onChange={(e) => handleInputChange(e, 'phonePrefix')}
                className="px-3 py-2 border border-gray-300 rounded-md w-1/4">
                <option value="010">010</option>
                <option value="011">011</option>
                <option value="016">016</option>
                <option value="017">017</option>
                <option value="018">018</option>
                <option value="019">019</option>
              </select>
              <span className="text-gray-500">-</span>
              <input
                type="text"
                name="phoneMiddle"
                value={phoneMiddle}
                onChange={(e) => handleInputChange(e, 'phoneMiddle')}
                className="px-3 py-2 border border-gray-300 rounded-md w-1/3"
                maxLength={4}
              />
              <span className="text-gray-500">-</span>
              <input
                type="text"
                name="phoneSuffix"
                value={phoneSuffix}
                onChange={(e) => handleInputChange(e, 'phoneSuffix')}
                className="px-3 py-2 border border-gray-300 rounded-md w-1/3"
                maxLength={4}
              />
            </div>
          </div>

          {/* 성별 선택 */}
          <div className="flex items-center">
            <label className="text-subtitle-1-lg font-p-500 w-24">성별</label>
            <div className="flex-1">
              <select
                name="gender"
                value={updatedUser?.gender}
                onChange={(e) => handleInputChange(e, 'gender')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="F">여자</option>
                <option value="M">남자</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;
