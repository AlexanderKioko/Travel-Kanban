'use client';

import { Suspense, use } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BoardView from '@/features/boards/BoardView';

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

const isValidBoardId = (boardId: string): boolean => {
  const reservedWords = ['dashboard', 'create', 'settings', 'profile', 'admin', 'api'];
  if (reservedWords.includes(boardId.toLowerCase())) return false;
  return true;
};

export default function BoardPage({ params }: BoardPageProps) {
  const resolvedParams = use(params);
  const { boardId } = resolvedParams;
  const router = useRouter();

  useEffect(() => {
    if (!isValidBoardId(boardId)) {
      console.log(`Invalid boardId detected: ${boardId}. Redirecting to boards list.`);
      router.replace('/boards');
    }
  }, [boardId, router]);

  if (!isValidBoardId(boardId)) {
    return null;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    }>
      <BoardView boardId={parseInt(boardId, 10)} />
    </Suspense>
  );
}