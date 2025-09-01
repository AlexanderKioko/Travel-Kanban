import { formatDate } from '@/lib/utils';
import { CheckSquare } from 'lucide-react';

interface UpcomingTask {
  id: number;
  title: string;
  board: string;
  dueDate: string;
}

interface UpcomingTasksProps {
  upcomingTasks: UpcomingTask[];
  formatDate: (dateString: string | null | undefined) => string;
}

export default function UpcomingTasks({ upcomingTasks, formatDate }: UpcomingTasksProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Upcoming Tasks</h2>
      </div>
      <div className="p-6 space-y-4">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
            >
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full flex-shrink-0">
                <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{task.title}</p>
                <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">{task.board}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Due {formatDate(task.dueDate)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <CheckSquare className="h-12 w-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No upcoming tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
