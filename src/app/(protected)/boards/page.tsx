'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, CreditCard, Users, MapPin, MoreVertical, Star, Archive } from 'lucide-react';

// Mock data - replace with actual API calls
const mockBoards = [
  {
    id: '1',
    title: 'Tokyo Adventure 2024',
    description: 'Cherry blossom season trip with cultural experiences and traditional cuisine exploration',
    status: 'active',
    budget: 4500,
    currency: 'USD',
    members: 2,
    progress: 75,
    startDate: '2024-03-15',
    endDate: '2024-03-25',
    createdAt: '2024-01-15',
    isFavorite: true,
    tags: ['International', 'Cultural', 'Romantic'],
    tasksCount: { planning: 3, booked: 8, completed: 12 },
    coverImage: null
  },
  {
    id: '2',
    title: 'Paris Romantic Getaway',
    description: 'Anniversary celebration with fine dining, museums, and romantic walks along the Seine',
    status: 'planning',
    budget: 3200,
    currency: 'USD',
    members: 2,
    progress: 30,
    startDate: '2024-05-10',
    endDate: '2024-05-17',
    createdAt: '2024-02-01',
    isFavorite: false,
    tags: ['International', 'Romantic', 'Anniversary'],
    tasksCount: { planning: 15, booked: 2, completed: 5 },
    coverImage: null
  },
  {
    id: '3',
    title: 'Family Beach Vacation',
    description: 'Summer holiday in Maldives with water sports, snorkeling, and family-friendly activities',
    status: 'completed',
    budget: 8050,
    currency: 'USD',
    members: 4,
    progress: 100,
    startDate: '2024-07-01',
    endDate: '2024-07-14',
    createdAt: '2023-12-10',
    isFavorite: true,
    tags: ['International', 'Family', 'Beach'],
    tasksCount: { planning: 0, booked: 0, completed: 25 },
    coverImage: null
  },
  {
    id: '4',
    title: 'Weekend Mountain Retreat',
    description: 'Quick getaway to the mountains for hiking, relaxation, and disconnecting from city life',
    status: 'active',
    budget: 800,
    currency: 'USD',
    members: 3,
    progress: 60,
    startDate: '2024-09-21',
    endDate: '2024-09-23',
    createdAt: '2024-08-15',
    isFavorite: false,
    tags: ['Domestic', 'Adventure', 'Nature'],
    tasksCount: { planning: 2, booked: 4, completed: 6 },
    coverImage: null
  },
  {
    id: '5',
    title: 'Business Trip - London',
    description: 'Corporate meetings, conference attendance, and networking opportunities in London',
    status: 'planning',
    budget: 2100,
    currency: 'USD',
    members: 1,
    progress: 20,
    startDate: '2024-10-15',
    endDate: '2024-10-20',
    createdAt: '2024-08-20',
    isFavorite: false,
    tags: ['International', 'Business', 'Networking'],
    tasksCount: { planning: 8, booked: 1, completed: 2 },
    coverImage: null
  },
  {
    id: '6',
    title: 'Road Trip - California Coast',
    description: 'Epic road trip along Highway 1 with stops at beaches, vineyards, and coastal towns',
    status: 'planning',
    budget: 1800,
    currency: 'USD',
    members: 2,
    progress: 15,
    startDate: '2024-11-05',
    endDate: '2024-11-12',
    createdAt: '2024-08-25',
    isFavorite: false,
    tags: ['Domestic', 'Road Trip', 'Coastal'],
    tasksCount: { planning: 12, booked: 0, completed: 3 },
    coverImage: null
  }
];

type FilterType = 'all' | 'active' | 'planning' | 'completed';
type SortType = 'recent' | 'title' | 'budget' | 'date';

export default function BoardsPage() {
  const [boards, setBoards] = useState(mockBoards);
  const [filteredBoards, setFilteredBoards] = useState(mockBoards);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // In a real app, fetch boards from API
    // fetchUserBoards();
  }, []);

  useEffect(() => {
    let filtered = boards;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        board =>
          board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          board.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          board.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(board => board.status === statusFilter);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'budget':
          return b.budget - a.budget;
        case 'date':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredBoards(filtered);
  }, [boards, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleFavorite = (boardId: string) => {
    setBoards(boards.map(board =>
      board.id === boardId ? { ...board, isFavorite: !board.isFavorite } : board
    ));
  };

  const getTotalTasks = (tasksCount: any) => {
    return tasksCount.planning + tasksCount.booked + tasksCount.completed;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Travel Boards</h1>
          <p className="text-gray-600 mt-1">
            Manage your travel plans and organize your trips
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/boards?create=true">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors">
              <Plus className="h-5 w-5" />
              Create New Board
            </button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search boards, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recent">Most Recent</option>
              <option value="title">Title A-Z</option>
              <option value="budget">Highest Budget</option>
              <option value="date">Trip Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredBoards.length} of {boards.length} boards
        </span>
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
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(board.status)}`}>
                      {board.status}
                    </span>
                    {board.isFavorite && (
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(board.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                    aria-label={board.isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star
                      className={`h-4 w-4 ${board.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                    />
                  </button>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">{board.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{board.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {board.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
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
                    <span className="font-medium text-gray-900">{board.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${board.progress}%` }}
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
                    <span>{board.members} member{board.members !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(board.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{getTotalTasks(board.tasksCount)} tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Create New Board Card */}
        <Link href="/boards?create=true" className="block">
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group h-full">
            <div className="flex flex-col items-center justify-center p-8 h-full min-h-[300px]">
              <div className="bg-blue-50 group-hover:bg-blue-100 p-4 rounded-full mb-4 transition-colors">
                <Plus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Board</h3>
              <p className="text-gray-600 text-center text-sm">
                Start planning your next adventure by creating a new travel board
              </p>
            </div>
          </div>
        </Link>
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
              ? "Try adjusting your search or filters"
              : "Get started by creating your first travel board"
            }
          </p>
          <Link href="/boards?create=true">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors">
              <Plus className="h-5 w-5" />
              Create New Board
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}