'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Calendar, CreditCard, Users, MapPin, Star, Loader2, CheckSquare, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { useGetBoards, useInviteUser } from '@/features/boards/hooks';
import { Board, List, Card } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import RecentBoards from './RecentBoards';
import UpcomingTasks from './UpcomingTasks';
import QuickActions from './QuickActions';
import { useSession } from '@/store/useSession';

// Normalize Board object to match @/types
const normalizeBoard = (board: any): Board => ({
  id: board.id,
  title: board.title,
  description: board.description ?? undefined,
  owner: board.owner,
  members: board.members,
  status: board.status,
  budget: board.budget,
  currency: board.currency,
  start_date: board.start_date ?? undefined,
  end_date: board.end_date ?? undefined,
  is_favorite: board.is_favorite,
  tags: board.tags,
  cover_image: board.cover_image ?? undefined,
  lists: board.lists?.map(normalizeList) || [],
  created_at: board.created_at,
  updated_at: board.updated_at,
});

// Normalize List object to match @/types
const normalizeList = (list: any): List => ({
  id: list.id,
  board: list.board,
  title: list.title,
  color: list.color,
  position: list.position,
  cards: list.cards?.map(normalizeCard) || [],
  created_at: list.created_at,
  updated_at: list.updated_at,
});

// Normalize Card object to match @/types
const normalizeCard = (card: any): Card => ({
  id: card.id,
  list: card.list,
  title: card.title,
  description: card.description ?? undefined,
  budget: card.budget,
  people_number: card.people_number,
  tags: card.tags,
  due_date: card.due_date ?? undefined,
  assigned_members: card.assigned_members,
  subtasks: card.subtasks,
  attachments: card.attachments,
  location: card.location ?? undefined,
  position: card.position,
  created_at: card.created_at,
  updated_at: card.updated_at,
  category: card.category,
  expense_id: card.expense_id,
});

interface DashboardStats {
  totalBoards: number;
  activeTrips: number;
  totalBudget: number;
  completedTasks: number;
  upcomingTasks: number;
  totalMembers: number;
}

export default function DashboardPage() {
  const { user } = useSession();
  const { data: boards = [], isLoading, error } = useGetBoards();
  const inviteUserMutation = useInviteUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'planning' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'budget' | 'date'>('recent');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const router = useRouter();

  // Normalize all boards
  const normalizedBoards = boards.map(normalizeBoard);

  // Initialize stats with useMemo to prevent object recreation
  const initialStats: DashboardStats = useMemo(() => ({
    totalBoards: 0,
    activeTrips: 0,
    totalBudget: 0,
    completedTasks: 0,
    upcomingTasks: 0,
    totalMembers: 0,
  }), []);

  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [recentBoards, setRecentBoards] = useState<Board[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<{ id: number; title: string; board: string; dueDate: string }[]>([]);

  // Helper function to extract first name from full name or use first_name
  const getFirstName = (userData: any) => {
    if (!userData) return 'User';
    return userData.first_name || (userData.name ? userData.name.split(' ')[0] : 'User');
  };

  // Handle invite submission
  const handleInviteSubmit = () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }
    inviteUserMutation.mutate({ email: inviteEmail.trim() }, {
      onSuccess: () => {
        toast.success('Invitation sent successfully!');
        setInviteEmail('');
        setIsInviteModalOpen(false);
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to send invitation');
      },
    });
  };

  // Type guard to ensure board is valid
  const isValidBoard = (board: any): board is Board => {
    return board &&
           typeof board === 'object' &&
           'id' in board &&
           'title' in board &&
           'status' in board &&
           'created_at' in board;
  };

  // Show error toast only once when error changes
  useEffect(() => {
    if (error) {
      console.error('Dashboard data loading error:', error);
      toast.error('Failed to load dashboard data');
    }
  }, [error]);

  // Calculate stats when boards data changes
  useEffect(() => {
    if (!Array.isArray(normalizedBoards)) {
      console.log('Boards data is not available or invalid:', normalizedBoards);
      return;
    }

    const validBoards = normalizedBoards.filter(isValidBoard);

    if (validBoards.length > 0) {
      try {
        const calculatedStats: DashboardStats = {
          totalBoards: validBoards.length,
          activeTrips: validBoards.filter((b) => b.status === 'active').length,
          totalBudget: validBoards.reduce((sum, b) => {
            const budget = parseFloat(b?.budget || '0');
            return sum + (isNaN(budget) ? 0 : budget);
          }, 0),
          completedTasks: validBoards.reduce(
            (sum, b) => {
              if (!b.lists || !Array.isArray(b.lists) || b.lists.length === 0) return sum;
              return sum + b.lists.reduce(
                (s, l) => {
                  if (!l?.title || !l?.cards || !Array.isArray(l.cards)) return s;
                  return s + (l.title.toLowerCase().includes('completed') ? l.cards.length : 0);
                },
                0
              );
            },
            0
          ),
          upcomingTasks: validBoards.flatMap((b) => {
            if (!b.lists || !Array.isArray(b.lists) || b.lists.length === 0) return [];
            return b.lists.flatMap((l) => {
              if (!l?.cards || !Array.isArray(l.cards)) return [];
              return l.cards.filter(
                (c) => c?.due_date && new Date(c.due_date) > new Date()
              );
            });
          }).length,
          totalMembers: Array.from(
            new Set(validBoards.flatMap((b) => {
              if (!b?.members || !Array.isArray(b.members)) return [];
              return b.members.map((m) => m?.id).filter(id => id != null);
            }))
          ).length,
        };

        setStats(calculatedStats);

        const sortedBoards = [...validBoards]
          .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          });

        setRecentBoards(sortedBoards.slice(0, 3));

        const tasks = validBoards
          .flatMap((b) => {
            if (!b.lists || !Array.isArray(b.lists) || b.lists.length === 0 || !b.title) return [];
            return b.lists.flatMap((l) => {
              if (!l?.cards || !Array.isArray(l.cards)) return [];
              return l.cards
                .filter((c) => c?.due_date && c?.title && new Date(c.due_date) > new Date())
                .map((c) => ({
                  id: c.id,
                  title: c.title,
                  board: b.title,
                  dueDate: c.due_date!,
                }));
            });
          })
          .sort(
            (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
          .slice(0, 3);

        setUpcomingTasks(tasks);
      } catch (statsError) {
        console.error('Error calculating dashboard stats:', statsError);
        toast.error('Error processing dashboard data');
        setStats(initialStats);
        setRecentBoards([]);
        setUpcomingTasks([]);
      }
    } else {
      setStats(initialStats);
      setRecentBoards([]);
      setUpcomingTasks([]);
    }
  }, [normalizedBoards, initialStats]);

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

  const calculateProgress = (board: Board) => {
    if (!board.lists || !Array.isArray(board.lists) || board.lists.length === 0) {
      return 0;
    }

    const total = board.lists.reduce(
      (sum: number, list: any) => {
        if (!list || !list.cards || !Array.isArray(list.cards)) return sum;
        return sum + list.cards.length;
      },
      0
    );

    if (total === 0) return 0;

    const completed = board.lists
      .filter((list: any) => list?.title?.toLowerCase().includes('completed'))
      .reduce(
        (sum: number, list: any) => {
          if (!list || !list.cards || !Array.isArray(list.cards)) return sum;
          return sum + list.cards.length;
        },
        0
      );

    return Math.round((completed / total) * 100);
  };

  // Filter recent boards by search
  const filteredRecentBoards = recentBoards.filter((board) => {
    return !searchTerm || board.title?.toLowerCase().includes(searchTerm.toLowerCase()) || board.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="text-center py-12">
          <div className="bg-red-50 dark:bg-red-950 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-12 w-12 text-red-400 dark:text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Unable to Load Dashboard</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're having trouble loading your dashboard data. Please try refreshing the page.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
            <Link href="/boards?create=true">
              <Button className="inline-flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Your First Board
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {getFirstName(user)}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Here's what's happening with your travel plans</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/boards?create=true">
            <Button className="inline-flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          placeholder="Search boards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Boards</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalBoards}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Trips</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.activeTrips}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Budget</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{formatCurrency(stats.totalBudget)}</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.completedTasks}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
              <CheckSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Upcoming Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.upcomingTasks}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Team Members</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{stats.totalMembers}</p>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Boards */}
        <RecentBoards
          boards={normalizedBoards}
          recentBoards={filteredRecentBoards}
          getStatusColor={getStatusColor}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          calculateProgress={calculateProgress}
        />

        {/* Upcoming Tasks and Quick Actions */}
        <div>
          <UpcomingTasks upcomingTasks={upcomingTasks} formatDate={formatDate} />
          <QuickActions setIsInviteModalOpen={setIsInviteModalOpen} />
        </div>
      </div>

      {/* Invite Team Members Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsInviteModalOpen(false); setInviteEmail(''); }}>
                Cancel
              </Button>
              <Button
                onClick={handleInviteSubmit}
                disabled={inviteUserMutation.isPending || !inviteEmail.trim()}
              >
                {inviteUserMutation.isPending ? 'Sending...' : 'Send Invite'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
