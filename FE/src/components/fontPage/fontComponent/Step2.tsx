import React, { useState, ChangeEvent } from 'react';
import { File, FileCheck } from 'lucide-react';
import useFontStore from '@/stores/useFontStore';

interface FileItem {
  id: string;
  name: string;
  file: File;
}

// 최대 파일 개수 상수 정의
const MAX_FILES = 8;

function Step2() {
  // Zustand 스토어에서 필요한 상태와 함수 가져오기
  const { uploadedFiles, addFiles, removeFile } = useFontStore();

  const [dragOver, setDragOver] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 현재 남은 업로드 가능한 파일 수 계산
  const remainingFiles = MAX_FILES - uploadedFiles.length;

  // 드래그 중인 요소가 목표 지점 진입할때
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  // 드래그 중인 요소가 목표 지점을 벗어날때
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  // 드래그 중인 요소가 목표 지점에 위치할때
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 파일 추가 처리 함수 (중복 코드 방지)
  const processFiles = (files: FileList) => {
    // 에러 메시지 초기화
    setError(null);

    // 파일 개수 체크
    if (uploadedFiles.length >= MAX_FILES) {
      setError(`최대 ${MAX_FILES}개까지만 업로드할 수 있습니다.`);
      return;
    }

    // 추가 가능한 파일 수 확인
    const allowedCount = Math.min(files.length, remainingFiles);

    if (allowedCount < files.length) {
      setError(
        `파일은 최대 ${MAX_FILES}개까지만 업로드할 수 있습니다. ${allowedCount}개만 추가됩니다.`,
      );
    }

    // 추가 가능한 파일만 필터링
    const filesToAdd = Array.from(files).slice(0, allowedCount);

    if (filesToAdd.length > 0) {
      const newFiles: FileItem[] = filesToAdd.map((file, index) => ({
        id: `IMG_${(uploadedFiles.length + index + 1).toString().padStart(2, '0')}`,
        name: file.name,
        file: file,
      }));

      // Zustand 스토어에 파일 추가
      addFiles(newFiles);
    }
  };

  // 드래그 중인 요소가 목표 지점에서 드롭될때
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    // 드래그되는 데이터 정보와 메서드를 제공하는 dataTransfer 객체 사용
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // 페이지 전체에 대한 기본 드래그 앤 드롭 동작 방지
  React.useEffect(() => {
    const preventDefaults = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        document.body.removeEventListener(eventName, preventDefaults, false);
      });
    };
  }, []);

  return (
    <div className="flex flex-col w-full space-y-6 p-4">
      <div className="text-xl font-bold mb-2">업로드 파일</div>

      {/* 파일 개수 표시 */}
      <div className="flex justify-between items-center">
        <div className="text-gray-600">
          <span
            className={remainingFiles === 0 ? 'text-red-500 font-bold' : ''}>
            {uploadedFiles.length}/{MAX_FILES} 파일 업로드됨
          </span>
        </div>
        {remainingFiles > 0 && (
          <div className="text-sm text-gray-500">
            {remainingFiles}개 더 업로드 가능
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="border rounded-lg p-4 flex flex-col items-center w-full overflow-hidden">
              <div className="w-12 h-12 mb-2">
                <FileCheck strokeWidth={1} width={'50px'} height={'50px'} />
              </div>
              <div className="text-sm font-medium line-clamp-2 text-center w-full overflow-hidden">
                {file.name}
              </div>
              <button
                onClick={() => {
                  removeFile(file.id);
                  setError(null); // 파일이 제거되면 에러 메시지도 제거
                }}
                className="mt-2 px-3 py-1 text-xs bg-gray-200 rounded-md hover:bg-gray-300">
                삭제
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-400 text-center py-6 w-full">
            업로드된 파일이 없습니다
          </div>
        )}
      </div>

      <div
        className={`mt-6 border border-dashed ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : remainingFiles === 0
              ? 'border-gray-400 bg-gray-100 cursor-not-allowed'
              : 'border-gray-900'
        } rounded-lg p-8 transition-colors`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4">
            <File
              strokeWidth={0.5}
              width={'75px'}
              height={'75px'}
              color={remainingFiles === 0 ? '#9CA3AF' : '#000000'}
            />
          </div>

          <label
            htmlFor="fileUpload"
            className={`mb-2 ${remainingFiles === 0 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            <div
              className={`px-4 py-2 rounded-md ${
                remainingFiles === 0
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
              } transition-colors`}>
              파일 업로드
            </div>
            {remainingFiles > 0 && (
              <input
                id="fileUpload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            )}
          </label>

          <div
            className={`text-sm ${remainingFiles === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
            {remainingFiles > 0
              ? '또는 파일을 업로드 하려면 파일을 여기에 끌어서 놓아주세요'
              : '최대 파일 개수에 도달했습니다. 파일을 삭제하고 다시 시도하세요.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2;
