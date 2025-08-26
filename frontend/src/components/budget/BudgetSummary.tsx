import React from 'react';
import { useBoardBudgetSummary } from '@/features/boards/hooks';

interface BudgetSummaryProps {
  boardId: number;
  onAddExpense: () => void;  // Callback to open add expense form/modal
  onViewAll: () => void;     // Callback to view all expenses
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ boardId, onAddExpense, onViewAll }) => {
  const { data, isLoading, error } = useBoardBudgetSummary(boardId);

  if (isLoading) return <div>Loading budget summary...</div>;
  if (error) return <div>Error loading budget summary: {error.message}</div>;
  if (!data) return <div>No budget data available.</div>;

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Budget Summary</h2>
      <p>Planned Budget: {data.board_budget} {data.by_category[0]?.total ? data.by_category[0].total.split('.')[0].replace(/\d{3}(?=\d)/g, '$&,') : ''}</p>
      <p>Actual Spend: {data.actual_spend_total}</p>
      <p>Remaining: {data.remaining}</p>
      <div className="mt-4">
        <h3 className="font-semibold">By Category:</h3>
        <ul>
          {data.by_category.map((cat, index) => (
            <li key={index}>{cat.category}: {cat.total}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex space-x-4">
        <button onClick={onAddExpense} className="bg-blue-500 text-white px-4 py-2 rounded">Add Expense</button>
        <button onClick={onViewAll} className="bg-gray-500 text-white px-4 py-2 rounded">View All</button>
      </div>
    </div>
  );
};

export default BudgetSummary;