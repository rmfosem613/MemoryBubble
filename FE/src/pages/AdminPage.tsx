import React from 'react';
import {
  AlertCircle,
  CircleCheck,
  Download,
  FileType2,
  Upload,
  Loader,
  CircleX,
} from 'lucide-react';
import useFontRequests, {
  FontRequest,
  FontFile,
} from '@/hooks/useFontRequests';
import useFileDownload from '@/hooks/useFileDownload';
import useFontUpload from '@/hooks/useFontUpload';
import JungKins from '@/assets/admin/JEONGKINS.png';
import Alert from '@/components/common/Alert';

// AlertAdmin 컴포넌트: 폰트 의뢰 알림 표시
interface AlertAdminProps {
  request: FontRequest;
  isSelected: boolean;
  onClick: () => void;
  onComplete: () => void;
  onDelete: () => void;
  isProcessing: boolean;
}

const AlertAdmin: React.FC<AlertAdminProps> = ({
  request,
  isSelected,
  onClick,
  onComplete,
  onDelete,
  isProcessing,
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 flex items-center justify-between border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-700 bg-white'} rounded-lg w-full h-[60px] cursor-pointer hover:bg-gray-50`}>
      <div className="flex items-center space-x-2">
        <AlertCircle
          className={`w-4 h-4 ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}
        />
        <span className={`font-medium text-sm text-gray-700`}>
          <span className="font-p-800 text-black">{request.userName}</span>님이
          <span className="font-p-800 text-blue-700 ml-1">
            {request.fontName}
          </span>{' '}
          폰트 생성을 의뢰하셨습니다.
        </span>
        <p className="text-xs text-gray-500">
          {new Date(request.createdAt).toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            // timeZone: 'Asia/Seoul',
          })}
        </p>
      </div>
      <div className="flex flex-row items-center space-x-2">
        {isProcessing ? (
          <Loader className="w-6 h-6 text-blue-500 animate-spin" />
        ) : (
          <>
            <CircleCheck
              className={`w-6 h-6 text-green-200 hover:text-green-500 cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
            />
            <CircleX
              className={`w-6 h-6 text-red-200 hover:text-red-700 cursor-pointer`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

interface DownloadFontProps {
  file: FontFile;
  index: number;
}

const DownloadFont: React.FC<DownloadFontProps> = ({ file }) => {
  const { isDownloading, actualFileName, handleDownload } =
    useFileDownload(file);

  return (
    <div
      className="flex border h-[70px] w-[150px] justify-center items-center space-x-2 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white"
      onClick={handleDownload}>
      <FileType2 width="40px" height="40px" strokeWidth={1} />
      <div className="">
        <span className="font-p-700">{actualFileName}</span>
      </div>
      {isDownloading ? (
        <Loader className="mt-1 text-blue-600 animate-spin" size={18} />
      ) : (
        <Download className="mt-1 text-blue-600" />
      )}
    </div>
  );
};

// AdminPage 컴포넌트: 관리자 페이지 메인
const AdminPage: React.FC = () => {
  // useFontUpload 먼저 초기화 - 파일 선택 기능 사용
  const {
    ttfFile,
    handleFileChange,
    handleDragOver,
    handleDrop,
    getCurrentFile,
    alertState,
  } = useFontUpload(null);

  // useFontRequests 사용 - getCurrentFile 함수 전달
  const {
    fontRequests,
    selectedRequest,
    handleSelectRequest,
    handleCompleteRequest,
    handleCancel,
    alertRequestState,
    isProcessing,
  } = useFontRequests(getCurrentFile);

  // selectedRequest가 변경되면 useFontUpload에 전달
  React.useEffect(() => {
    // 이 부분은 useFontUpload 내부에서 참조하도록 수정이 필요할 수 있음
    // 현재는 useFontUpload가 selectedRequest를 파라미터로 받는 방식
  }, [selectedRequest]);

  return (
    <div className="container pt-[68px] space-y-3">
      {/* Header section */}
      <div className="flex py-[10px] border border-x-0 border-t-0 border-gray-700 space-x-1 items-end">
        <img src={JungKins} alt="Jung Kins 로고" className="h-10" />
        <span className="font-p-700 text-h5-lg">Jung kins</span>
        <span className="font-p-500 text-subtitle-1-lg flex mb-[1.3px]">
          페이지
        </span>
      </div>

      {/* Alert section */}
      <div className="font-p-500 text-subtitle-1-lg">폰트 생성 의뢰 목록</div>
      <div className="flex flex-col space-y-3 border bg-gray-200 min-h-[300px] w-full p-4 overflow-y-auto">
        {fontRequests.length > 0 ? (
          fontRequests.map((request) => (
            <AlertAdmin
              key={request.fontId}
              request={request}
              isSelected={selectedRequest?.fontId === request.fontId}
              onClick={() => handleSelectRequest(request)}
              onComplete={() => handleCompleteRequest(request.fontId)}
              onDelete={() => handleCancel(request.fontId)}
              isProcessing={
                isProcessing && selectedRequest?.fontId === request.fontId
              }
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-500">
            의뢰 목록이 없습니다.
          </div>
        )}
      </div>

      {/* Font template section */}
      <div className="font-p-500 text-subtitle-1-lg">폰트 템플릿</div>
      <div className="grid grid-cols-12 border border-gray-500 min-h-[200px]">
        {/* Left section - PNG files */}
        <div className="col-span-8 flex flex-col">
          <p className="font-p-700 text-center py-2 bg-gray-100">
            사용자가 작성한 폰트 png
          </p>
          {selectedRequest ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 p-4 h-full overflow-y-auto">
              {selectedRequest.files.map((file, index) => (
                <DownloadFont key={index} file={file} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              의뢰를 선택하면 PNG 파일이 표시됩니다.
            </div>
          )}
        </div>

        {/* Right section - TTF upload */}
        <div className="col-span-4 flex flex-col">
          <p className="font-p-700 text-center py-2 bg-gray-100">
            S3, DB에 .ttf 파일 저장
          </p>
          <div className="flex flex-col items-center justify-center p-4 h-full">
            {selectedRequest ? (
              <div
                className={`border border-gray-500 w-full h-full ${ttfFile ? 'bg-green-50' : 'bg-gray-100'} rounded-[8px] border-dashed flex flex-col items-center justify-center p-4`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}>
                {ttfFile ? (
                  <>
                    <FileType2
                      className="w-12 h-12 text-green-600 mb-2"
                      strokeWidth={1}
                    />
                    <p className="text-sm text-center">{ttfFile.name}</p>
                    <p className="text-green-600 font-medium text-center">
                      파일이 선택되었습니다.
                    </p>
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      파일 선택
                      <input
                        type="file"
                        accept=".ttf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm text-center mb-2">
                      여기에 TTF 파일을 끌어다 놓거나
                    </p>
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      파일 선택
                      <input
                        type="file"
                        accept=".ttf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </>
                )}
              </div>
            ) : (
              <div className="text-gray-500">
                의뢰를 선택하면 TTF 파일을 업로드할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      </div>
      {alertState && (
        <Alert message={alertState.message} color={alertState.color} />
      )}
      {alertRequestState && (
        <Alert
          message={alertRequestState.message}
          color={alertRequestState.color}
        />
      )}
    </div>
  );
};

export default AdminPage;
