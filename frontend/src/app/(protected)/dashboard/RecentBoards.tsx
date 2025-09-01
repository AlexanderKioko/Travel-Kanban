import Link from 'next/link';
import { Board } from '@/types';
import { CreditCard, Users, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentBoardsProps {
  boards: Board[];
  recentBoards: Board[];
  getStatusColor: (status: string) => string;
  formatCurrency: (amount: number | string, currency?: string) => string;
  formatDate: (dateString: string | null | undefined) => string;
  calculateProgress: (board: Board) => number;
}

export default function RecentBoards({
  boards,
  recentBoards,
  getStatusColor,
  formatCurrency,
  formatDate,
  calculateProgress,
}: RecentBoardsProps) {
  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Boards</h2>
            <Link href="/boards" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {recentBoards.length > 0 ? (
            recentBoards.map((board) => (
              <Link key={board.id} href={`/boards/${board.id}`}>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{board.title || 'Untitled Board'}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(board.status || 'planning')}`}>
                          {board.status || 'planning'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{board.description || 'No description'}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          {formatCurrency(parseFloat(board.budget || '0'))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {board.members?.length || 0} members
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(board.start_date)} - {formatDate(board.end_date)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{calculateProgress(board)}%</div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${calculateProgress(board)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No boards yet</p>
              <Link href="/boards?create=true">
                <Button className="inline-flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create Your First Board
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
