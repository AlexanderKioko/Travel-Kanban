import React, { memo, useCallback } from 'react';
import { useBoardBudgetSummary, useGetBoard } from '@/features/boards/hooks';
import { Button } from '@/components/ui/button';

interface BudgetSummaryProps {
  boardId: number;
  onAddExpense: () => void;
  onViewAll: () => void;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ boardId, onAddExpense, onViewAll }) => {
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useBoardBudgetSummary(boardId);
  const { data: board, isLoading: boardLoading, error: boardError } = useGetBoard(boardId);

  if (summaryLoading || boardLoading) return <div aria-live="polite">Loading budget summary...</div>;
  if (summaryError || boardError) {
    const errorMessage = summaryError?.message || boardError?.message || 'Unknown error';
    return <div aria-live="assertive">Error loading budget summary: {errorMessage}</div>;
  }
  if (!summary || !board) return <div aria-live="polite">No budget data available.</div>;

  const formatCurrency = useCallback((amount: string, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(parseFloat(amount));
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md" role="region" aria-label="Budget Summary">
      <h2 className="text-xl font-bold mb-4">Budget Summary</h2>
      <p>Planned Budget: {formatCurrency(summary.board_budget, board.currency)}</p>
      <p>Actual Spend: {formatCurrency(summary.actual_spend_total, board.currency)}</p>
      <p>Remaining: {formatCurrency(summary.remaining, board.currency)}</p>
      <div className="mt-4">
        <h3 className="font-semibold">By Category:</h3>
        <ul>
          {summary.by_category.map((cat, index) => (
            <li key={index}>{cat.category}: {formatCurrency(cat.total, board.currency)}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex space-x-4">
        <Button onClick={onAddExpense} aria-label="Add new expense">Add Expense</Button>
        <Button onClick={onViewAll} variant="secondary" aria-label="View all expenses">View All</Button>
      </div>
    </div>
  );
};

export default memo(BudgetSummary);