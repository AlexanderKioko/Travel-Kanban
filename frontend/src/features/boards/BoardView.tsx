import { useState } from 'react';
import { DragDropContext, DropResult, DroppableProvided } from '@hello-pangea/dnd';
import ListColumn from './ListColumn';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreateList, useMoveCard, useGetBoard, useUpdateBoard, Board, List } from './hooks';
import { toast } from 'sonner';
import { ArrowLeft, Share2, Settings, Star, Calendar, CreditCard, Users, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BoardViewProps {
  boardId: number;
}

export default function BoardView({ boardId }: BoardViewProps) {
  const { data: board, isLoading } = useGetBoard(boardId);
  const { mutate: moveCard } = useMoveCard();
  const { mutate: updateBoard } = useUpdateBoard(boardId);
  const { mutate: createList, isPending: isCreatingList } = useCreateList(boardId);
  const [newListTitle, setNewListTitle] = useState('');
  const router = useRouter();

  if (isLoading || !board) {
    return <div>Loading board...</div>;
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const cardId = parseInt(draggableId);
    const new_list_id = parseInt(destination.droppableId);
    const old_list_id = parseInt(source.droppableId);
    const new_position = destination.index;

    moveCard(
      { cardId, new_list_id: new_list_id !== old_list_id ? new_list_id : undefined, new_position, boardId },
      {
        onError: (error) => toast.error('Failed to move card', { description: error.message }),
      }
    );
  };

  const handleAddList = () => {
    if (!newListTitle.trim()) return;
    createList({ title: newListTitle }, {
      onSuccess: () => setNewListTitle(''),
      onError: (error) => toast.error('Failed to create list', { description: error.message }),
    });
  };

  const toggleFavorite = () => {
    updateBoard({ is_favorite: !board.is_favorite });
  };

  const formatCurrency = (amount: string, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 0 }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTotalBudget = (board: Board) => {
    return board.lists.reduce((total, list) => {
      return total + list.cards.reduce((listTotal, card) => listTotal + (parseFloat(card.budget) * card.people_number), 0);
    }, 0).toFixed(2);
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
    return colors[tag.length % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
                  <button onClick={toggleFavorite}>
                    <Star className={`h-5 w-5 ${board.is_favorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">{board.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(board.start_date)} - {formatDate(board.end_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard className="h-4 w-4" />
              <span>{formatCurrency(getTotalBudget(board), board.currency)} total budget</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{board.members.length} member{board.members.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{board.lists.reduce((total, list) => total + list.cards.length, 0)} tasks</span>
            </div>
          </div>
          {board.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {board.tags.map((tag) => (
                <span key={tag} className={`text-xs px-2 py-1 rounded-full ${getTagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6">
            {board.lists.sort((a: List, b: List) => a.position - b.position).map((list: List) => (
              <ListColumn key={list.id} list={list} boardId={boardId} />
            ))}
            <div className="flex-shrink-0 w-80">
              <div className="flex gap-2">
                <Input
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="New list title"
                />
                <Button onClick={handleAddList} disabled={isCreatingList || !newListTitle.trim()}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}