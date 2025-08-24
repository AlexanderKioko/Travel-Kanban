'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Plus, Calendar, CreditCard, CheckSquare, Users, TrendingUp, MapPin } from 'lucide-react';

// Mock data - replace with actual API calls
const mockStats = {
  totalBoards: 8,
  activeTrips: 3,
  totalBudget: 15750,
  completedTasks: 47,
  upcomingTasks: 12,
  totalMembers: 6
};

const mockRecentBoards = [
  {
    id: '1',
    title: 'Tokyo Adventure 2024',
    description: 'Cherry blossom season trip',
    status: 'active',
    budget: 4500,
    members: 2,
    progress: 75,
    startDate: '2024-03-15',
    endDate: '2024-03-25'
  },
  {
    id: '2',
    title: 'Paris Romantic Getaway',
    description: 'Anniversary celebration',
    status: 'planning',
    budget: 3200,
    members: 2,
    progress: 30,
    startDate: '2024-05-10',
    endDate: '2024-05-17'
  },
  {
    id: '3',
    title: 'Family Beach Vacation',
    description: 'Summer holiday in Maldives',
    status: 'completed',
    budget: 8050,
    members: 4,
    progress: 100,
    startDate: '2024-07-01',
    endDate: '2024-07-14'
  }
];

const mockUpcomingTasks = [
  { id: '1', title: 'Book flight tickets', board: 'Tokyo Adventure 2024', dueDate: '2024-09-15' },
  { id: '2', title: 'Reserve hotel room', board: 'Paris Romantic Getaway', dueDate: '2024-09-18' },
  { id: '3', title: 'Apply for visa', board: 'Tokyo Adventure 2024', dueDate: '2024-09-20' },
];

export default function DashboardPage() {
  const [user, setUser] = useState({ name: 'Alex', firstName: 'Alex' });
  const [stats, setStats] = useState(mockStats);
  const [recentBoards, setRecentBoards] = useState(mockRecentBoards);
  const [upcomingTasks, setUpcomingTasks] = useState(mockUpcomingTasks);

  // In a real app, you'd fetch this data from your API
  useEffect(() => {
    // fetchUserData();
    // fetchDashboardStats();
    // fetchRecentBoards();
    // fetchUpcomingTasks();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your travel plans
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Boards</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBoards}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Trips</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeTrips}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalBudget)}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedTasks}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <CheckSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingTasks}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMembers}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Boards */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Boards</h2>
                <Link href="/boards" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all →
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {recentBoards.map((board) => (
                <Link key={board.id} href={`/boards/${board.id}`}>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{board.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(board.status)}`}>
                            {board.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{board.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            {formatCurrency(board.budget)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {board.members} members
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(board.startDate)} - {formatDate(board.endDate)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-gray-900">{board.progress}%</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${board.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
            </div>
            <div className="p-6 space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{task.board}</p>
                    <p className="text-gray-500 text-xs mt-1">Due {formatDate(task.dueDate)}</p>
                  </div>
                </div>
              ))}
              
              {upcomingTasks.length === 0 && (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 mt-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link href="/boards?create=true">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3">
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Create New Board</span>
                </button>
              </Link>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Browse Templates</span>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-900">Invite Team Members</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}