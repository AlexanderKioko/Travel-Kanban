import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

interface QuickActionsProps {
  setIsInviteModalOpen: (open: boolean) => void;
}

export default function QuickActions({ setIsInviteModalOpen }: QuickActionsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h2>
      </div>
      <div className="p-6 space-y-3">
        <Link href="/boards?create=true">
          <Button variant="outline" className="w-full text-left flex items-center gap-3">
            <Plus className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900 dark:text-gray-100">Create New Board</span>
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="w-full text-left flex items-center gap-3"
          onClick={() => setIsInviteModalOpen(true)}
        >
          <Users className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-gray-900 dark:text-gray-100">Invite Team Members</span>
        </Button>
      </div>
    </div>
  );
}