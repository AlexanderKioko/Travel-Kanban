'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Search, Filter, Calendar, CreditCard, Users, MapPin, Star } from 'lucide-react';
import BoardCreationModal from '@/features/boards/BoardCreationModal';
import { useGetBoards, useUpdateBoard } from '@/features/boards/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Image from 'next/image';

type FilterType = 'all' | 'active' | 'planning' | 'completed';
type SortType = 'recent' | 'title' | 'budget' | 'date';

export default function BoardsPage() {
  const { data: boards = [], isLoading, error } = useGetBoards();
  const { mutate: updateBoard } = useUpdateBoard();
  const [filteredBoards, setFilteredBoards] = useState(boards);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const searchParams = useSearchParams();
  const router = useRouter();
  const showCreateModal = searchParams.get('create') === 'true';

  useEffect(() => {
    if (error) {
      console.error('Boards loading error:', error);
      toast.error('Failed to load boards');
    }
  }, [error]);

  useEffect(() => {
    // Add safety checks for boards data
    if (!boards || !Array.isArray(boards)) {
      console.log('Boards data is not available or invalid:', boards);
      setFilteredBoards([]);
      return;
    }

    let filtered = boards.filter(board => board && typeof board === 'object');

    if (searchTerm) {
      filtered = filtered.filter(
        (board) =>
          board.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          board.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (board.tags && Array.isArray(board.tags) && board.tags.some((tag) => tag?.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((board) => board.status === statusFilter);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'budget':
          const budgetA = parseFloat(a.budget || '0');
          const budgetB = parseFloat(b.budget || '0');
          return budgetB - budgetA;
        case 'date':
          const dateA = a.start_date ? new Date(a.start_date).getTime() : Infinity;
          const dateB = b.start_date ? new Date(b.start_date).getTime() : Infinity;
          return dateA - dateB;
        case 'recent':
        default:
          const createdA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const createdB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return createdB - createdA;
      }
    });

    setFilteredBoards(filtered);
  }, [boards, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'planning':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: string, currency: string = 'USD') => {
    const numAmount = parseFloat(amount || '0');
    if (isNaN(numAmount)) return '$0';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  const toggleFavorite = (boardId: number, currentFavorite: boolean) => {
    try {
      updateBoard({
        boardId,
        data: { is_favorite: !currentFavorite }
      }, {
        onError: () => toast.error('Failed to update favorite'),
      });
    } catch (error) {
      console.error('Toggle favorite error:', error);
      toast.error('Failed to update favorite');
    }
  };

  const calculateProgress = (board: (typeof boards)[0]) => {
    if (!board?.lists || !Array.isArray(board.lists)) return 0;
    
    const totalTasks = board.lists.reduce((sum, list) => {
      if (!list?.cards || !Array.isArray(list.cards)) return sum;
      return sum + list.cards.length;
    }, 0);
    
    if (totalTasks === 0) return 0;
    
    const completedTasks = board.lists
      .filter((list) => list?.title?.toLowerCase().includes('completed'))
      .reduce((sum, list) => {
        if (!list?.cards || !Array.isArray(list.cards)) return sum;
        return sum + list.cards.length;
      }, 0);
    
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const getTasksCount = (board: (typeof boards)[0]) => {
    if (!board?.lists || !Array.isArray(board.lists)) {
      return { planning: 0, booked: 0, completed: 0 };
    }

    return board.lists.reduce((acc, list) => {
      if (!list?.title || !list?.cards || !Array.isArray(list.cards)) return acc;
      
      const key = list.title.toLowerCase();
      if (key.includes('planning')) acc.planning += list.cards.length;
      else if (key.includes('booked')) acc.booked += list.cards.length;
      else if (key.includes('completed')) acc.completed += list.cards.length;
      return acc;
    }, { planning: 0, booked: 0, completed: 0 });
  };

  const getTotalTasks = (tasksCount: ReturnType<typeof getTasksCount>) => {
    return tasksCount.planning + tasksCount.booked + tasksCount.completed;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading boards...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <div className="bg-red-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Boards</h3>
          <p className="text-gray-600 mb-6">
            We're having trouble loading your boards. Please try refreshing the page.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
            <Button onClick={() => router.push('/boards?create=true')} className="inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Board
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Travel Boards</h1>
          <p className="text-gray-600 mt-1">Manage your travel plans and organize your trips</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => router.push('/boards?create=true')} className="inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Board
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search boards, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => {}} className="inline-flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value: FilterType) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value: SortType) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Most Recent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="budget">Highest Budget</SelectItem>
                <SelectItem value="date">Trip Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Showing {filteredBoards.length} of {boards.length} boards</span>
        {(searchTerm || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBoards.map((board) => (
          <Link key={board.id} href={`/boards/${board.id}`}>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group">
              {/* Card Header */}
              <div className="p-6 pb-4">
                {board.cover_image && (
                  <div className="mb-4">
                    <Image 
                      src={board.cover_image} 
                      alt={board.title || 'Board cover'} 
                      width={400} 
                      height={200} 
                      className="rounded-lg object-cover" 
                    />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(board.status || 'planning')}`}>
                      {board.status || 'planning'}
                    </span>
                    {board.is_favorite && <Star className="h-4 w-4 text-yellow-400 fill-current" />}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(board.id, board.is_favorite);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                    aria-label={board.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star
                      className={`h-4 w-4 ${board.is_favorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                    />
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{board.title || 'Untitled Board'}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{board.description || 'No description'}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {board.tags && Array.isArray(board.tags) ? board.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  )) : null}
                  {board.tags && Array.isArray(board.tags) && board.tags.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      +{board.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{calculateProgress(board)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${calculateProgress(board)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">{formatCurrency(board.budget || '0', board.currency || 'USD')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{board.members?.length || 0} member{(board.members?.length || 0) !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(board.start_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{getTotalTasks(getTasksCount(board))} tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Create New Board Card */}
        <div
          onClick={() => router.push('/boards?create=true')}
          className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group h-full min-h-[300px] flex flex-col items-center justify-center p-8"
        >
          <div className="bg-blue-50 group-hover:bg-blue-100 p-4 rounded-full mb-4 transition-colors">
            <Plus className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Board</h3>
          <p className="text-gray-600 text-center text-sm">Start planning your next adventure by creating a new travel board</p>
        </div>
      </div>

      {/* Empty State */}
      {filteredBoards.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No boards found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first travel board'}
          </p>
          <Button onClick={() => router.push('/boards?create=true')} className="inline-flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Board
          </Button>
        </div>
      )}

      <BoardCreationModal open={showCreateModal} onClose={() => router.push('/boards')} />
    </div>
  );
}