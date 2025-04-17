'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect } from 'react';

// Defining the API response type
interface ApiResponse {
  integers: number[];
  nextPage: number;
}

// Defining the fetch function
const fetchIntegers = async ({ pageParam }: { pageParam: number }) => {
  const res = await fetch(`/api/integers?page=${pageParam}`);
  return res.json() as Promise<ApiResponse>;
};

export default function InfiniteList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['integers'] as const,
    queryFn: fetchIntegers,
    initialPageParam: 1,
    getNextPageParam: (lastPage: ApiResponse) => lastPage.nextPage,
  });

  const allIntegers = data?.pages.flatMap((page) => page.integers) || [];
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: allIntegers.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 10,
  });

  useEffect(() => {
    const [lastItem] = rowVirtualizer.getVirtualItems().slice(-1);
    if (
      lastItem &&
      lastItem.index >= allIntegers.length - 5 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    rowVirtualizer.getVirtualItems(),
    allIntegers.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  return (
    <div
  ref={parentRef}
  style={{
    height: '80vh',
    overflow: 'auto',
    margin: '0 auto',
    width: '100%',
    maxWidth: '1200px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    backgroundColor: '#fafafa',
  }}
>
  <div
    style={{
      height: `${rowVirtualizer.getTotalSize()}px`,
      position: 'relative',
    }}
  >
    {rowVirtualizer.getVirtualItems().map((virtualItem) => (
      <div
        key={virtualItem.key}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${virtualItem.size}px`,
          transform: `translateY(${virtualItem.start}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #ddd',
          backgroundColor: '#fff',
          fontSize: '18px',
          fontWeight: 500,
          transition: 'background 0.2s ease',
        }}
      >
        {allIntegers[virtualItem.index]}
      </div>
    ))}
  </div>
  {isFetchingNextPage && (
    <div style={{ padding: '16px', textAlign: 'center' }}>Loading more...</div>
  )}
</div>
  );
}