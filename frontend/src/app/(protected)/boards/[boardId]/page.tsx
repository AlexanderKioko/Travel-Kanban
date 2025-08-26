'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import BoardView from '@/features/boards/BoardView';

interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

const isValidBoardId = (boardId: string): boolean => {
  // First check if it's a reserved word that should redirect to boards list
  const reservedWords = ['dashboard', 'create', 'settings', 'profile', 'admin', 'api'];
  if (reservedWords.includes(boardId.toLowerCase())) {
    return false;
  }
  
  // Check if it's a valid number
  const numericId = parseInt(boardId, 10);
  return !isNaN(numericId) && numericId > 0;
};

function BoardPageContent({ boardId }: { boardId: string }) {
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);
  
  // Memoize the validation result to prevent recalculation
  const isValid = useMemo(() => isValidBoardId(boardId), [boardId]);

  useEffect(() => {
    const validateAndRedirect = () => {
      if (!isValid) {
        console.log(`Invalid boardId detected: ${boardId}. Redirecting to boards list.`);
        router.replace('/boards');
        return;
      }
      setIsValidating(false);
    };

    validateAndRedirect();
  }, [boardId, router, isValid]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating board...</p>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return null; // This shouldn't render due to the redirect above
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BoardView boardId={parseInt(boardId, 10)} />
    </div>
  );
}

export default function BoardPage({ params }: BoardPageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ boardId: string } | null>(null);
  const [paramError, setParamError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolved = await params;
        
        // Check for reserved words immediately after resolving params
        const reservedWords = ['dashboard', 'create', 'settings', 'profile', 'admin', 'api'];
        if (reservedWords.includes(resolved.boardId.toLowerCase())) {
          console.log(`Reserved word detected in boardId: ${resolved.boardId}. Redirecting to boards list.`);
          router.replace('/boards');
          return;
        }
        
        setResolvedParams(resolved);
      } catch (error) {
        console.error('Failed to resolve params:', error);
        setParamError('Failed to load board parameters');
      }
    };

    resolveParams();
  }, [params, router]);

  if (paramError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Board</h3>
          <p className="text-gray-600 mb-6">{paramError}</p>
          <button
            onClick={() => router.push('/boards')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading board...</p>
        </div>
      </div>
    );
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
      <BoardPageContent boardId={resolvedParams.boardId} />
    </Suspense>
  );
}