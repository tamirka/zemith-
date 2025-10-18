
import React from 'react';
import Card from './common/Card';
import { useBookkeeping } from '../hooks/useBookkeeping';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const Dashboard: React.FC = () => {
  const { transactions, invoices } = useBookkeeping();

  const totalRevenue = transactions.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const outstandingInvoices = invoices.filter(i => i.status === 'Sent' || i.status === 'Overdue').reduce((acc, i) => acc + i.items.reduce((itemAcc, item) => itemAcc + item.price * item.quantity, 0), 0);

  const chartData = [
    { name: 'Jan', Income: 4000, Expenses: 2400 },
    { name: 'Feb', Income: 3000, Expenses: 1398 },
    { name: 'Mar', Income: 2000, Expenses: 9800 },
    { name: 'Apr', Income: 2780, Expenses: 3908 },
    { name: 'May', Income: 1890, Expenses: 4800 },
    { name: 'Jun', Income: 2390, Expenses: 3800 },
  ];

  const StatCard: React.FC<{ title: string, value: string, change?: string, changeType?: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => (
    <Card>
      <h4 className="text-neutral-500 font-medium">{title}</h4>
      <p className="text-3xl font-bold text-neutral-800 mt-2">{value}</p>
      {change && <p className={`text-sm mt-1 ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>{change}</p>}
    </Card>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} change="+12% from last month" changeType="increase" />
        <StatCard title="Total Expenses" value={`$${totalExpenses.toFixed(2)}`} change="+8% from last month" changeType="decrease" />
        <StatCard title="Net Profit" value={`$${netProfit.toFixed(2)}`} change="+15% from last month" changeType="increase" />
        <StatCard title="Outstanding" value={`$${outstandingInvoices.toFixed(2)}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card title="Income vs Expenses">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Income" fill="#3b82f6" />
              <Bar dataKey="Expenses" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Cash Flow">
           <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Income" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
