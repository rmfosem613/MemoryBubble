import React, { useState, ChangeEvent } from 'react';
import { File, FileCheck } from 'lucide-react';
import useFontStore from '@/stores/useFontStore';

interface FileItem {
  id: string;
  name: string;
  file: File;
  realType: string; // 실제 파일 타입 정보 추가
}

// 최대 파일 개수 상수 정의
const MAX_FILES = 8;

// 허용된 파일 타입 정의 (JPG와 PNG만)
const ALLOWED_FILE_TYPES = [
  { type: 'png', mimeType: 'image/png', signature: '89504e470d0a1a0a' },
  {
    type: 'jpg',
    mimeType: 'image/jpeg',
    signatures: ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2', 'ffd8ffdb', 'ffd8ffe3'],
  },
];

// 허용된 파일 타입 문자열 (오류 메시지 표시용)
const ALLOWED_TYPE_NAMES = 'JPG, PNG';

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

  // 파일 시그니처 검증 함수
  const checkFileSignature = async (
    file: File,
  ): Promise<{ isValid: boolean; fileType: string | null }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target || !e.target.result) {
          resolve({ isValid: false, fileType: null });
          return;
        }

        const arr = new Uint8Array(e.target.result as ArrayBuffer).subarray(
          0,
          8,
        );
        const header = Array.from(arr)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        // PNG 시그니처 확인
        if (
          header
            .toLowerCase()
            .startsWith(ALLOWED_FILE_TYPES[0].signature.toLowerCase())
        ) {
          resolve({ isValid: true, fileType: 'png' });
          return;
        }

        // JPG 시그니처 확인
        const jpgSignatures = ALLOWED_FILE_TYPES[1].signatures;
        for (const sig of jpgSignatures) {
          if (header.toLowerCase().startsWith(sig.toLowerCase())) {
            resolve({ isValid: true, fileType: 'jpg' });
            return;
          }
        }

        // 시그니처가 일치하지 않음
        resolve({ isValid: false, fileType: null });
      };
      reader.onerror = () => resolve({ isValid: false, fileType: null });
      reader.readAsArrayBuffer(file.slice(0, 8));
    });
  };

  // 수정된 파일명 패턴 검사 - 이제 숫자만 확인
  const isValidFileName = (filename: string): boolean => {
    // 파일명에서 확장자 제외한 부분만 가져오기
    const nameWithoutExt = filename.split('.')[0];
    // 1부터 8까지의 숫자인지 확인
    return /^[1-8]$/.test(nameWithoutExt);
  };

  // 파일 처리 함수 수정
  const processFiles = async (files: FileList) => {
    // 에러 메시지 초기화
    setError(null);

    // 파일 개수 체크
    if (uploadedFiles.length >= MAX_FILES) {
      setError(`최대 ${MAX_FILES}개까지만 업로드할 수 있습니다.`);
      return;
    }

    // 파일 크기 제한: 600KB
    const MAX_FILE_SIZE = 600 * 1024; // 600KB를 바이트로 변환

    // 이미 업로드된 파일명 목록 생성
    const existingFileNames = uploadedFiles.map((item) => item.name);

    // 파일 형식 및 이름 필터링
    const validFiles: Array<{ file: File; realType: string }> = [];
    const invalidFiles: string[] = [];
    const invalidNameFiles: string[] = [];
    const duplicateFiles: string[] = [];
    const oversizedFiles: string[] = [];

    // 모든 파일에 대해 비동기 검증을 위한 Promise 배열
    const fileChecks: Promise<void>[] = [];

    Array.from(files).forEach((file) => {
      const check = async () => {
        // 파일 크기 체크
        if (file.size > MAX_FILE_SIZE) {
          oversizedFiles.push(file.name);
          return;
        }

        // 파일명 중복 체크
        if (existingFileNames.includes(file.name)) {
          duplicateFiles.push(file.name);
          return;
        }

        // 파일명 패턴 체크
        if (!isValidFileName(file.name)) {
          invalidNameFiles.push(file.name);
          return;
        }

        // 파일 시그니처 체크 - 실제 형식만 확인
        const { isValid, fileType } = await checkFileSignature(file);
        if (!isValid) {
          invalidFiles.push(file.name);
          return;
        }

        validFiles.push({ file, realType: fileType as string });
      };

      fileChecks.push(check());
    });

    // 모든 파일 검증이 완료될 때까지 대기
    await Promise.all(fileChecks);

    // 에러 메시지 구성
    const errorMessages = [];

    // 파일 크기 초과 파일이 있는 경우
    if (oversizedFiles.length > 0) {
      errorMessages.push(
        `파일 크기는 600KB 이하여야 합니다: ${oversizedFiles.join(', ')}`,
      );
    }

    // 유효하지 않은 형식 파일이 있는 경우
    if (invalidFiles.length > 0) {
      errorMessages.push(
        `${ALLOWED_TYPE_NAMES} 형식만 업로드할 수 있습니다: ${invalidFiles.join(', ')}`,
      );
    }

    // 유효하지 않은 파일명이 있는 경우
    if (invalidNameFiles.length > 0) {
      errorMessages.push(`"1"부터 "8"까지의 파일명만 허용됩니다`);
    }

    // 중복 파일이 있는 경우
    if (duplicateFiles.length > 0) {
      errorMessages.push(
        `이미 업로드된 파일입니다: ${duplicateFiles.join(', ')}`,
      );
    }

    // 에러 메시지 설정
    if (errorMessages.length > 0) {
      setError(errorMessages.join(' '));

      // 유효한 파일이 없으면 함수 종료
      if (validFiles.length === 0) {
        return;
      }
    }

    // 추가 가능한 파일 수 확인
    const remainingFiles = MAX_FILES - uploadedFiles.length;
    const allowedCount = Math.min(validFiles.length, remainingFiles);

    if (allowedCount < validFiles.length) {
      errorMessages.push(
        `파일은 최대 ${MAX_FILES}개까지만 업로드할 수 있습니다. ${allowedCount}개만 추가됩니다.`,
      );
      setError(errorMessages.join(' '));
    }

    // 추가 가능한 파일만 필터링
    const filesToAdd = validFiles.slice(0, allowedCount);

    // 고유 ID 생성 함수 추가
    const generateUniqueId = () => {
      return `IMG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // 수정된 파일 처리 함수의 일부분
    if (filesToAdd.length > 0) {
      const newFiles: FileItem[] = filesToAdd.map(({ file, realType }) => ({
        id: generateUniqueId(), // 고유 ID 생성
        name: file.name,
        file: file,
        realType: realType, // 실제 파일 타입 정보 추가
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
      <div className="flex flex-row justify-between">
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
            <div className="text-sm text-gray-500 ml-2">
              {remainingFiles}개 더 업로드 가능
            </div>
          )}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* 파일 리스트 - 단일 행으로 표시하고 필요시 가로 스크롤 */}
      <div className="w-full overflow-x-auto">
        <div className="flex flex-nowrap min-w-full gap-4 pb-2">
          {uploadedFiles.length > 0 ? (
            uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="border rounded-lg p-4 flex flex-col items-center flex-shrink-0 w-36 h-36">
                <FileCheck strokeWidth={1} width={'50px'} height={'50px'} />
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
            <div className="w-full text-gray-400 text-center py-6">
              업로드된 파일이 없습니다
            </div>
          )}
        </div>
      </div>

      <div
        className={`mt-6 border border-dashed ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : remainingFiles === 0
              ? 'border-gray-400 bg-gray-100 cursor-not-allowed'
              : 'border-gray-900'
        } rounded-lg p-4 transition-colors`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4">
            <File
              strokeWidth={1}
              width={'59px'}
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
                // accept 속성 제거 - 모든 파일을 선택할 수 있게 함
              />
            )}
          </label>

          <div
            className={`text-sm ${remainingFiles === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
            {remainingFiles > 0
              ? `또는 ${ALLOWED_TYPE_NAMES} 형식의 파일을 여기에 끌어서 놓아주세요`
              : '최대 파일 개수에 도달했습니다. 파일을 삭제하고 다시 시도하세요.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2;
