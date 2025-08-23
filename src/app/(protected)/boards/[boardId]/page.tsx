// src/app/boards/[boardId]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Calendar, 
  CreditCard, 
  Users, 
  MapPin, 
  Tag, 
  Clock, 
  Star, 
  Share2, 
  Settings 
} from 'lucide-react';

// Mock data for a single board
const mockBoard = {
  id: '1',
  title: 'Tokyo Adventure 2024',
  description: 'Cherry blossom season trip with cultural experiences and traditional cuisine exploration',
  status: 'active',
  budget: 4500,
  currency: 'USD',
  members: [
    { id: '1', name: 'Alex Johnson', avatar: null, role: 'owner' },
    { id: '2', name: 'Sarah Chen', avatar: null, role: 'editor' }
  ],
  startDate: '2024-03-15',
  endDate: '2024-03-25',
  createdAt: '2024-01-15',
  isFavorite: true,
  tags: ['International', 'Cultural', 'Romantic'],
  coverImage: null
};

const mockLists = [
  {
    id: '1',
    title: 'Planning',
    color: 'blue',
    order: 1,
    cards: [
      {
        id: '1',
        title: 'Research best neighborhoods to stay',
        description: 'Look into Shibuya, Harajuku, and Ginza areas for accommodation options',
        budget: 0,
        peopleNumber: 2,
        tags: ['research', 'accommodation'],
        dueDate: '2024-09-20',
        assignedMembers: ['1'],
        subtasks: [
          { id: '1', title: 'Check Airbnb options', completed: true },
          { id: '2', title: 'Research hotel ratings', completed: false },
          { id: '3', title: 'Compare neighborhood safety', completed: false }
        ],
        attachments: [],
        location: null,
        createdAt: '2024-08-15'
      },
      {
        id: '2',
        title: 'Apply for Japan visa',
        description: 'Submit visa application with all required documents',
        budget: 150,
        peopleNumber: 2,
        tags: ['visa', 'documents'],
        dueDate: '2024-09-25',
        assignedMembers: ['1', '2'],
        subtasks: [
          { id: '1', title: 'Gather passport photos', completed: true },
          { id: '2', title: 'Fill out application form', completed: false },
          { id: '3', title: 'Book embassy appointment', completed: false }
        ],
        attachments: [],
        location: null,
        createdAt: '2024-08-16'
      },
      {
        id: '3',
        title: 'Plan cherry blossom viewing spots',
        description: 'Research best locations and timing for hanami',
        budget: 0,
        peopleNumber: 2,
        tags: ['sightseeing', 'cherry-blossom'],
        dueDate: '2024-09-30',
        assignedMembers: ['2'],
        subtasks: [],
        attachments: [],
        location: { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
        createdAt: '2024-08-17'
      }
    ]
  },
  {
    id: '2',
    title: 'Booked',
    color: 'green',
    order: 2,
    cards: [
      {
        id: '4',
        title: 'Flight tickets to Tokyo',
        description: 'Round trip flights via ANA, departing March 15th',
        budget: 1800,
        peopleNumber: 2,
        tags: ['flights', 'transportation'],
        dueDate: null,
        assignedMembers: ['1'],
        subtasks: [
          { id: '1', title: 'Select seats', completed: true },
          { id: '2', title: 'Add baggage', completed: true },
          { id: '3', title: 'Online check-in', completed: false }
        ],
        attachments: [
          { id: '1', name: 'flight-confirmation.pdf', size: '245KB' }
        ],
        location: null,
        createdAt: '2024-08-10'
      },
      {
        id: '5',
        title: 'Hotel reservation - Shibuya',
        description: 'Boutique hotel near Shibuya crossing, 7 nights',
        budget: 1400,
        peopleNumber: 2,
        tags: ['accommodation', 'hotel'],
        dueDate: null,
        assignedMembers: ['2'],
        subtasks: [
          { id: '1', title: 'Request room upgrade', completed: false },
          { id: '2', title: 'Arrange airport transfer', completed: true }
        ],
        attachments: [],
        location: { name: 'Shibuya, Tokyo', lat: 35.6598, lng: 139.7006 },
        createdAt: '2024-08-12'
      },
      {
        id: '6',
        title: 'JR Pass - 7 days',
        description: 'Japan Rail Pass for unlimited train travel',
        budget: 280,
        peopleNumber: 2,
        tags: ['transportation', 'rail'],
        dueDate: null,
        assignedMembers: ['1'],
        subtasks: [],
        attachments: [],
        location: null,
        createdAt: '2024-08-14'
      }
    ]
  },
  {
    id: '3',
    title: 'In Progress',
    color: 'yellow',
    order: 3,
    cards: [
      {
        id: '7',
        title: 'Pack suitcases',
        description: 'Pack clothes and essentials for 10-day trip',
        budget: 0,
        peopleNumber: 2,
        tags: ['packing', 'preparation'],
        dueDate: '2024-09-28',
        assignedMembers: ['1', '2'],
        subtasks: [
          { id: '1', title: 'Check weather forecast', completed: true },
          { id: '2', title: 'Pack spring clothes', completed: false },
          { id: '3', title: 'Prepare travel documents', completed: true },
          { id: '4', title: 'Pack electronics and chargers', completed: false }
        ],
        attachments: [],
        location: null,
        createdAt: '2024-08-20'
      },
      {
        id: '8',
        title: 'Download offline maps',
        description: 'Download Tokyo maps and translation apps',
        budget: 0,
        peopleNumber: 1,
        tags: ['apps', 'navigation'],
        dueDate: '2024-09-30',
        assignedMembers: ['1'],
        subtasks: [],
        attachments: [],
        location: null,
        createdAt: '2024-08-22'
      }
    ]
  },
  {
    id: '4',
    title: 'Completed',
    color: 'gray',
    order: 4,
    cards: [
      {
        id: '9',
        title: 'Passport renewal',
        description: 'Renewed passport valid for 10 years',
        budget: 130,
        peopleNumber: 2,
        tags: ['documents', 'passport'],
        dueDate: null,
        assignedMembers: ['1', '2'],
        subtasks: [
          { id: '1', title: 'Submit application', completed: true },
          { id: '2', title: 'Provide biometric data', completed: true },
          { id: '3', title: 'Collect new passports', completed: true }
        ],
        attachments: [],
        location: null,
        createdAt: '2024-07-15'
      },
      {
        id: '10',
        title: 'Travel insurance',
        description: 'Comprehensive travel insurance for Japan trip',
        budget: 120,
        peopleNumber: 2,
        tags: ['insurance', 'safety'],
        dueDate: null,
        assignedMembers: ['2'],
        subtasks: [],
        attachments: [
          { id: '1', name: 'insurance-policy.pdf', size: '156KB' }
        ],
        location: null,
        createdAt: '2024-07-20'
      }
    ]
  }
];

interface BoardPageProps {
  params: { boardId: string };
}

export default function BoardPage({ params }: BoardPageProps) {
  const router = useRouter();
  const [board, setBoard] = useState(mockBoard);
  const [lists, setLists] = useState(mockLists);
  const [showBoardSettings, setShowBoardSettings] = useState(false);

  useEffect(() => {
    // In a real app, fetch board and lists data
    // fetchBoard(params.boardId);
    // fetchLists(params.boardId);
  }, [params.boardId]);

  const getListColor = (color: string) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      yellow: 'border-yellow-200 bg-yellow-50',
      gray: 'border-gray-200 bg-gray-50',
      purple: 'border-purple-200 bg-purple-50',
      red: 'border-red-200 bg-red-50',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-yellow-100 text-yellow-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
    ];
    const index = tag.length % colors.length;
    return colors[index];
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
      day: 'numeric'
    });
  };

  const getTotalBudget = () => {
    return lists.reduce((total, list) => {
      return total + list.cards.reduce((listTotal, card) => {
        return listTotal + (card.budget * (card.peopleNumber || 1));
      }, 0);
    }, 0);
  };

  const getCompletedSubtasks = (subtasks: any[]) => {
    return subtasks.filter(subtask => subtask.completed).length;
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Go back to boards"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
                  {board.isFavorite && (
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{board.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={() => setShowBoardSettings(!showBoardSettings)}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>

          {/* Board Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(board.startDate)} - {formatDate(board.endDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span>{formatCurrency(getTotalBudget(), board.currency)} total budget</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{board.members.length} member{board.members.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{lists.reduce((total, list) => total + list.cards.length, 0)} tasks</span>
            </div>
          </div>

          {/* Board Tags */}
          {board.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {board.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 overflow-x-auto pb-6">
          {lists.map((list) => (
            <div
              key={list.id}
              className={`flex-shrink-0 w-80 rounded-lg border-2 ${getListColor(list.color)}`}
            >
              {/* List Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {list.title}
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {list.cards.length}
                    </span>
                  </h3>
                  <button className="p-1 hover:bg-gray-200 rounded transition-colors" aria-label={`More options for ${list.title}`}>
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Cards */}
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {list.cards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1">
                        {card.title}
                      </h4>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity ml-2" aria-label="More options">
                        <MoreVertical className="h-3 w-3 text-gray-400" />
                      </button>
                    </div>

                    {/* Card Description */}
                    {card.description && (
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {card.description}
                      </p>
                    )}

                    {/* Card Tags */}
                    {card.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {card.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {card.tags.length > 2 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            +{card.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Subtasks Progress */}
                    {card.subtasks.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Subtasks</span>
                          <span>{getCompletedSubtasks(card.subtasks)}/{card.subtasks.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full transition-all"
                            style={{
                              width: `${(getCompletedSubtasks(card.subtasks) / card.subtasks.length) * 100}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {/* Budget */}
                        {card.budget > 0 && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <CreditCard className="h-3 w-3" />
                            <span>{formatCurrency(card.budget * (card.peopleNumber || 1))}</span>
                          </div>
                        )}

                        {/* Due Date */}
                        {card.dueDate && (
                          <div className={`flex items-center gap-1 ${
                            isOverdue(card.dueDate) ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(card.dueDate)}</span>
                          </div>
                        )}

                        {/* Location */}
                        {card.location && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3 w-3" />
                            <span>Location</span>
                          </div>
                        )}

                        {/* Attachments */}
                        {card.attachments.length > 0 && (
                          <div className="flex items-center gap-1 text-gray-600">
                            <Tag className="h-3 w-3" />
                            <span>{card.attachments.length}</span>
                          </div>
                        )}
                      </div>

                      {/* Assigned Members */}
                      {card.assignedMembers.length > 0 && (
                        <div className="flex -space-x-1">
                          {card.assignedMembers.slice(0, 2).map((memberId) => {
                            const member = board.members.find(m => m.id === memberId);
                            return (
                              <div
                                key={memberId}
                                className="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium border border-white"
                                title={member?.name}
                              >
                                {member?.name.charAt(0).toUpperCase()}
                              </div>
                            );
                          })}
                          {card.assignedMembers.length > 2 && (
                            <div className="w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-medium border border-white">
                              +{card.assignedMembers.length - 2}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Card Button */}
                <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 text-sm flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add a card
                </button>
              </div>
            </div>
          ))}

          {/* Add List */}
          <div className="flex-shrink-0 w-80">
            <button className="w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-600 flex items-center justify-center gap-2">
              <Plus className="h-5 w-5" />
              Add another list
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}