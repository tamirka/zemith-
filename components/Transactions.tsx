import React, { useState } from 'react';
import Card from './common/Card';
import Modal from './common/Modal';
import { useBookkeeping } from '../hooks/useBookkeeping';
import { Transaction, TransactionStatus, TransactionCategory, TRANSACTION_CATEGORIES } from '../types';

const statusColors: { [key in TransactionStatus]: string } = {
  [TransactionStatus.Completed]: 'bg-green-100 text-green-800',
  [TransactionStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [TransactionStatus.Failed]: 'bg-red-100 text-red-800',
};

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
    <tr className="border-b border-neutral-200 hover:bg-neutral-50">
        <td className="py-3 px-4 text-neutral-700">{transaction.date}</td>
        <td className="py-3 px-4 text-neutral-800 font-medium">
            {transaction.description}
        </td>
        <td className="py-3 px-4 text-neutral-600">{transaction.category}</td>
        <td className={`py-3 px-4 font-semibold ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
            {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </td>
        <td className="py-3 px-4">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[transaction.status]}`}>
                {transaction.status}
            </span>
        </td>
    </tr>
);

const TransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 mb-3">
    <div className="flex justify-between items-start">
      <div>
        <p className="font-semibold text-neutral-800">
          {transaction.description}
        </p>
        <p className="text-sm text-neutral-500">{transaction.date} &bull; {transaction.category}</p>
      </div>
      <p className={`font-bold text-lg ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
        {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </p>
    </div>
    <div className="text-right mt-2">
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[transaction.status]}`}>
        {transaction.status}
      </span>
    </div>
  </div>
);

const NewTransactionForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { addTransaction } = useBookkeeping();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'Income' | 'Expense'>('Expense');
    const [category, setCategory] = useState<TransactionCategory>('Other');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTransaction: Omit<Transaction, 'id'> = {
            date: new Date().toISOString().split('T')[0],
            description,
            amount: parseFloat(amount),
            type,
            category,
            status: TransactionStatus.Completed,
        };
        addTransaction(newTransaction);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
                <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"/>
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-neutral-700">Amount</label>
                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent" />
            </div>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-neutral-700">Type</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent">
                    <option>Income</option>
                    <option>Expense</option>
                </select>
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700">Category</label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as any)} className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent">
                    {TRANSACTION_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-secondary">Add Transaction</button>
            </div>
        </form>
    )
}

const Transactions: React.FC = () => {
  const { transactions } = useBookkeeping();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">Transactions</h2>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-secondary transition-colors w-full md:w-auto">
                Add Transaction
            </button>
        </div>
      
        <div className="hidden md:block">
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-neutral-200">
                                <th className="py-3 px-4 font-semibold text-neutral-600">Date</th>
                                <th className="py-3 px-4 font-semibold text-neutral-600">Description</th>
                                <th className="py-3 px-4 font-semibold text-neutral-600">Category</th>
                                <th className="py-3 px-4 font-semibold text-neutral-600">Amount</th>
                                <th className="py-3 px-4 font-semibold text-neutral-600">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => <TransactionRow key={t.id} transaction={t} />)}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>

        <div className="md:hidden">
            {transactions.map(t => <TransactionCard key={t.id} transaction={t} />)}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Transaction">
            <NewTransactionForm onClose={() => setIsModalOpen(false)} />
        </Modal>
    </div>
  );
};

export default Transactions;