import { useState, useEffect, useRef, ReactNode } from "react";

interface InfiniteScrollProps {
  items: any[];          // 표시할 아이템 배열
  renderItem: (item: any, index: number) => ReactNode;  // 아이템 렌더링 함수
  loadMoreItems: () => void;  // 추가 아이템 로드 함수
  hasMore: boolean;      // 더 로드할 아이템이 있는지 여부
  itemsPerPage?: number; // 페이지당 아이템 수
  loadingIndicator?: ReactNode; // 로딩 인디케이터
  className?: string;    // 그리드 컨테이너에 적용할 클래스
}

const InfiniteScroll = ({
  items,
  renderItem,
  loadMoreItems,
  hasMore,
  loadingIndicator,
  className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 px-1",
}: InfiniteScrollProps) => {
  // Intersection Observer를 위한 ref
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 관찰 대상이 화면에 보이고 더 로드할 항목이 있으면 로드 함수 호출
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    // 로딩 표시
    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      // 관찰 대상 목록에 추가
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        // 관찰 대상 목록에 제거
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [loadMoreItems, hasMore]);

  return (
    <>
      <div className={className}>
        {items.map((item, index) => (
          <div
            key={index}
            // 마지막 사진 observe
            ref={index === items.length - 5 ? observerRef : null}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {/* 로딩 표시기 및 Intersection Observer 타겟 */}
      {hasMore && (
        <div
          ref={loadingRef}
          className="flex justify-center items-center p-4 h-20"
        >
          {/* 로딩 표시 */}
          {loadingIndicator || (
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;