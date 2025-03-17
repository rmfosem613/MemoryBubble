import React, { useState, ChangeEvent } from 'react';
import { File, FileCheck } from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  file: File;
}

function Step2() {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [dragOver, setDragOver] = useState<boolean>(false);

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

  // 드래그 중인 요소가 목표 지점에서 드롭될때
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    // 드래그되는 데이터 정보와 메서드를 제공하는 dataTransfer 객체 사용
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      const newFiles: FileItem[] = Array.from(e.dataTransfer.files).map(
        (file, index) => ({
          id: `IMG_${(uploadedFiles.length + index + 1).toString().padStart(2, '0')}`,
          name: file.name,
          file: file,
        }),
      );

      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles: FileItem[] = Array.from(e.target.files).map(
        (file, index) => ({
          id: `IMG_${(uploadedFiles.length + index + 1).toString().padStart(2, '0')}`,
          name: file.name,
          file: file,
        }),
      );

      console.log(newFiles);

      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter((file) => file.id !== id));
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

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="border rounded-lg p-4 flex flex-col items-center w-full overflow-hidden">
              <div className="w-12 h-12 mb-2">
                <FileCheck strokeWidth={0.5} width={'50px'} height={'50px'} />
              </div>
              <div className="text-sm font-medium line-clamp-2 text-center w-full overflow-hidden">
                {file.name}
              </div>
              <button
                onClick={() => handleRemoveFile(file.id)}
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
        className={`mt-6 border border-dashed ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-900'} rounded-lg p-8 transition-colors`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}>
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4">
            <File strokeWidth={0.5} width={'75px'} height={'75px'} />
          </div>

          <label htmlFor="fileUpload" className="mb-2">
            <div className="px-4 py-2 bg-blue-100 text-blue-500 rounded-md cursor-pointer hover:bg-blue-200 transition-colors">
              파일 업로드
            </div>
            <input
              id="fileUpload"
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="text-sm text-gray-900">
            또는 파일을 업로드 하려면 파일을 여기에 끌어서 놓아주세요
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2;
