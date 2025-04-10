import { useEffect, useState } from 'react';
import Title from '../common/Title';
import FontEditor from './fontComponent/FontEditor';
import FontActions from './fontComponent/FontActions';
import useFontDownload from '@/hooks/useFontDownload';
import useFont from '@/hooks/useFont';
import useTextAreaRef from '@/hooks/useTextAreaRef';
import Alert from '../common/Alert';
import Modal from '../common/Modal/Modal';
import apiClient from '@/apis/apiClient';

// FontDeleteModal 컴포넌트
interface FontDeleteModalProps {
  isOpen: boolean;
  close: () => void;
  fontId: string;
  fontName: string | null;
  onDeleteSuccess: () => void;
  onDeleteError: (error: any) => void;
}

function FontDeleteModal({
  isOpen,
  close,
  fontId,
  fontName,
  onDeleteSuccess,
  onDeleteError,
}: FontDeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!fontId) return false;

    // 삭제 요청 시작
    setIsLoading(true);

    try {
      // 폰트 삭제 API 호출
      const response = await apiClient.delete(`/api/fonts/${fontId}`);
      console.log('폰트 삭제 결과:', response);

      // 브라우저에 로드된 폰트 스타일 요소 제거
      const styleElement = document.getElementById(`font-style-${fontId}`);
      if (styleElement) {
        styleElement.remove();
      }

      // 성공 콜백 호출
      onDeleteSuccess();
      return true; // 모달 닫기
    } catch (error) {
      console.error('폰트 삭제 중 오류 발생:', error);
      onDeleteError(error);
      return false; // 모달 유지
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title="폰트 삭제"
      cancelButtonText="취소하기"
      confirmButtonText={isLoading ? '삭제 중...' : '삭제하기'}
      onConfirm={handleConfirm}
      isConfirmDisabled={isLoading}>
      <p className="py-4">
        [{' '}
        <span className="text-blue-500">{fontName || '사용자 정의 폰트'}</span>{' '}
        ] 폰트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
      </p>
    </Modal>
  );
}

// props 타입을 인터페이스로 정의
interface FontDownloadProps {
  fontId: string;
}

// props를 객체 형태로 받도록 수정
function FontDownload({ fontId }: FontDownloadProps) {
  const { text, fontSize, setText, setFontSize } = useFont();

  const {
    downloadFont,
    fontLoaded,
    fontFamily,
    fontName,
    alertState,
    showAlert,
  } = useFontDownload();

  const { currentFontFamily, setCurrentFontFamily } = useTextAreaRef();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 폰트가 로드되면 현재 폰트 패밀리 업데이트
  useEffect(() => {
    if (fontLoaded && fontFamily) {
      setCurrentFontFamily(fontFamily);
    }
  }, [fontLoaded, fontFamily, setCurrentFontFamily]);

  // 폰트 삭제 모달 열기
  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // 폰트 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // 폰트 삭제 성공 시 호출될 콜백
  const handleDeleteSuccess = () => {
    // 상태 초기화
    setCurrentFontFamily('pretendard');

    // 성공 알림 표시
    showAlert('폰트가 성공적으로 삭제되었습니다.', 'green');

    // 필요한 경우 페이지 새로고침
    window.location.reload();
  };

  // 폰트 삭제 실패 시 호출될 콜백
  const handleDeleteError = (error: any) => {
    showAlert('폰트 삭제 중 오류가 발생했습니다.', 'red');
  };

  return (
    <div className="container">
      {alertState && (
        <Alert message={alertState.message} color={alertState.color} />
      )}
      <div className="flex items-baseline justify-between mb-3">
        <Title text="나의 손글씨" />
        <p className="pt-1 pl-2 text-gray-600 text-subtitle-1-lg font-p-500">
          나만의 폰트를 확인해보고 다운로드 해보세요
        </p>
      </div>

      <div className="bg-white rounded-lg p-4 mb-6">
        <div className="text-h3-lg font-p-700 mb-2">{fontName}</div>

        <FontEditor
          text={text}
          fontSize={fontSize}
          onTextChange={setText}
          onFontSizeChange={setFontSize}
          autoFocus={true}
          currentFontFamily={currentFontFamily}
          setCurrentFontFamily={setCurrentFontFamily}
        />

        <FontActions
          onDownload={downloadFont}
          onReset={handleOpenDeleteModal} // 삭제 버튼 클릭 시 모달 열기
        />
      </div>

      {/* 폰트 삭제 확인 모달 */}
      <FontDeleteModal
        isOpen={isDeleteModalOpen}
        close={handleCloseDeleteModal}
        fontId={fontId}
        fontName={fontName}
        onDeleteSuccess={handleDeleteSuccess}
        onDeleteError={handleDeleteError}
      />
    </div>
  );
}

export default FontDownload;
