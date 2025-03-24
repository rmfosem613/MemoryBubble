import React, { useState } from 'react';
import { useUserStore } from '@/stores/useUserStroe';
import { Camera, Calendar } from 'lucide-react';

const ProfileModal = () => {
  const { user } = useUserStore();

  // 전화번호 파싱 - 조건 없이 바로 파싱
  const phoneNumberParts = user?.phoneNumber?.split('-') || [];
  const phonePrefix = phoneNumberParts[0] || '010';
  const phoneMiddle = phoneNumberParts[1] || '';
  const phoneSuffix = phoneNumberParts[2] || '';

  return (
    <div className="w-full p-2 flex flex-col justify-center space-y-4">
      {/* 프로필 이미지 */}
      <div className="relative w-24 h-24 ">
        <img
          src={user?.profileUrl}
          alt="프로필 이미지"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm cursor-pointer">
          <Camera />
        </div>
      </div>

      {/* 이름 입력 */}
      <div className="flex items-center">
        <label className="text-subtitle-1-lg font-p-500 w-24">이름(별명)</label>
        <div className="flex-1">
          <input
            type="text"
            name="name"
            defaultValue={user?.name || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* 생년월일 입력 */}
      <div className=" flex items-center">
        <label className="text-subtitle-1-lg font-p-500 w-24">생년월일</label>
        <div className="relative flex-1">
          <input
            type="text"
            name="birthDate"
            defaultValue={user?.birth || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Calendar />
          </span>
        </div>
      </div>

      {/* 전화번호 입력 */}
      <div className="flex items-center">
        <label className="text-subtitle-1-lg font-p-500 w-24">전화번호</label>
        <div className="flex items-center space-x-2 flex-1">
          <select
            name="phonePrefix"
            defaultValue={phonePrefix}
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
            defaultValue={phoneMiddle}
            className="px-3 py-2 border border-gray-300 rounded-md w-1/3"
            maxLength={4}
          />
          <span className="text-gray-500">-</span>
          <input
            type="text"
            name="phoneSuffix"
            defaultValue={phoneSuffix}
            className="px-3 py-2 border border-gray-300 rounded-md w-1/3"
            maxLength={4}
          />
        </div>
      </div>

      {/* 성별 선택 */}
      <div className=" flex items-center">
        <label className="text-subtitle-1-lg font-p-500 w-24">성별</label>
        <div className="flex-1">
          <select
            name="gender"
            defaultValue={user?.gender}
            className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="female">여자</option>
            <option value="male">남자</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
