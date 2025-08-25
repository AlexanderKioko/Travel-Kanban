import { useState } from 'react';
import { Droppable, DroppableProvided } from '@hello-pangea/dnd';
import { Plus, MoreVertical } from 'lucide-react';
import CardItem from './CardItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateCard, List, Card } from './hooks';

interface ListColumnProps {
  list: List;
  boardId: number;
}

export default function ListColumn({ list, boardId }: ListColumnProps) {
  const [newCardTitle, setNewCardTitle] = useState('');
  const { mutate: createCard, isPending } = useCreateCard(boardId, list.id);

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    createCard({ title: newCardTitle }, {
      onSuccess: () => setNewCardTitle(''),
    });
  };

  const getListColor = (color: string) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      yellow: 'border-yellow-200 bg-yellow-50',
      gray: 'border-gray-200 bg-gray-50',
    };
    return colors[color as keyof typeof colors] || 'border-blue-200 bg-blue-50';
  };

  return (
    <div className={`flex-shrink-0 w-80 rounded-lg border-2 ${getListColor(list.color)}`}>
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
      <Droppable droppableId={list.id.toString()}>
        {(provided: DroppableProvided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="p-4 space-y-3 min-h-[100px]"
          >
            {list.cards.sort((a: Card, b: Card) => a.position - b.position).map((card: Card, index: number) => (
              <CardItem key={card.id} card={card} index={index} boardId={boardId} listId={list.id} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="New card title"
          />
          <Button onClick={handleAddCard} disabled={isPending || !newCardTitle.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}