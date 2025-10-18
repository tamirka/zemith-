
import React from 'react';
import Card from './common/Card';
import { useBookkeeping } from '../hooks/useBookkeeping';

const Reports: React.FC = () => {
  const { transactions } = useBookkeeping();

  const income = transactions.filter(t => t.type === 'Income');
  const expenses = transactions.filter(t => t.type === 'Expense');

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">Reports</h2>
        <button className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-secondary transition-colors w-full md:w-auto">
          Download PDF
        </button>
      </div>

      <Card title="Profit & Loss Statement">
        <div className="p-0 sm:p-4 space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <h4 className="text-lg font-semibold text-neutral-800">Total Income</h4>
            <p className="text-lg font-bold text-green-600">${totalIncome.toFixed(2)}</p>
          </div>
          <div className="pl-0 sm:pl-4 space-y-2 text-sm">
            {income.map(t => (
              <div key={t.id} className="flex justify-between text-neutral-600">
                <span>{t.description}</span>
                <span>${t.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center py-2 border-b mt-6">
            <h4 className="text-lg font-semibold text-neutral-800">Total Expenses</h4>
            <p className="text-lg font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
          </div>
          <div className="pl-0 sm:pl-4 space-y-2 text-sm">
            {expenses.map(t => (
              <div key={t.id} className="flex justify-between text-neutral-600">
                <span>{t.description}</span>
                <span>${t.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t-2 mt-6">
            <h4 className="text-xl font-bold text-neutral-900">Net Profit</h4>
            <p className={`text-xl font-extrabold ${netProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              ${netProfit.toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
