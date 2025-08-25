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
  const [filteredBoards, setFilteredBoards] = useState(boards);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const searchParams = useSearchParams();
  const router = useRouter();
  const showCreateModal = searchParams.get('create') === 'true';

  useEffect(() => {
    if (error) {
      toast.error('Failed to load boards');
    }
  }, [error]);

  useEffect(() => {
    let filtered = boards;

    if (searchTerm) {
      filtered = filtered.filter(
        (board) =>
          board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (board.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
          board.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((board) => board.status === statusFilter);
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'budget':
          return parseFloat(b.budget) - parseFloat(a.budget);
        case 'date':
          return (a.start_date ? new Date(a.start_date).getTime() : Infinity) - (b.start_date ? new Date(b.start_date).getTime() : Infinity);
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const toggleFavorite = (boardId: number, currentFavorite: boolean) => {
    const { mutate: update } = useUpdateBoard(boardId);
    update({ is_favorite: !currentFavorite }, {
      onError: () => toast.error('Failed to update favorite'),
    });
  };

  const calculateProgress = (board: (typeof boards)[0]) => {
    const totalTasks = board.lists.reduce((sum, list) => sum + list.cards.length, 0);
    if (totalTasks === 0) return 0;
    const completedTasks = board.lists
      .filter((list) => list.title.toLowerCase().includes('completed'))
      .reduce((sum, list) => sum + list.cards.length, 0);
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const getTasksCount = (board: (typeof boards)[0]) => {
    return board.lists.reduce((acc, list) => {
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
    return <div className="text-center py-12">Loading boards...</div>;
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
              <SelectTrigger>
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
              <SelectTrigger>
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
                    <Image src={board.cover_image} alt={board.title} width={400} height={200} className="rounded-lg object-cover" />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(board.status)}`}>
                      {board.status}
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

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{board.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{board.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {board.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                  {board.tags.length > 3 && (
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
                    <span className="font-medium">{formatCurrency(board.budget, board.currency)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{board.members.length} member{board.members.length !== 1 ? 's' : ''}</span>
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