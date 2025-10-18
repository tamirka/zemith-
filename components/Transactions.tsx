import React, { useState } from 'react';
import Card from './common/Card';
import Modal from './common/Modal';
import { useBookkeeping } from '../hooks/useBookkeeping';
import { Transaction, TransactionStatus, TransactionCategory, TRANSACTION_CATEGORIES } from '../types';
import { suggestCategory, analyzeReceipt } from '../services/geminiService';
import { ICONS } from '../constants';

const statusColors: { [key in TransactionStatus]: string } = {
  [TransactionStatus.Completed]: 'bg-green-100 text-green-800',
  [TransactionStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [TransactionStatus.Failed]: 'bg-red-100 text-red-800',
};

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
    <tr className="border-b border-neutral-200 hover:bg-neutral-50">
        <td className="py-3 px-4 text-neutral-700">{transaction.date}</td>
        <td className="py-3 px-4 text-neutral-800 font-medium flex items-center space-x-2">
            <span>{transaction.description}</span>
            {transaction.receiptUrl && <span title="Receipt attached">{ICONS.Receipt}</span>}
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
        <p className="font-semibold text-neutral-800 flex items-center space-x-2">
          <span>{transaction.description}</span>
          {transaction.receiptUrl && <span title="Receipt attached">{ICONS.Receipt}</span>}
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

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });


const NewTransactionForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { addTransaction } = useBookkeeping();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'Income' | 'Expense'>('Expense');
    const [category, setCategory] = useState<TransactionCategory>('Other');
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSuggestCategory = async () => {
        if (!description) return;
        setIsSuggesting(true);
        const suggested = await suggestCategory(description);
        if (suggested) setCategory(suggested);
        setIsSuggesting(false);
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setReceiptFile(file);
        setReceiptPreview(URL.createObjectURL(file));
        setIsAnalyzing(true);

        try {
            const base64Data = await fileToBase64(file);
            const result = await analyzeReceipt(file.type, base64Data);
            if (result) {
                setDescription(result.description);
                setAmount(result.amount.toString());
            }
        } catch (error) {
            console.error("Error processing receipt:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newTransaction: Omit<Transaction, 'id'> = {
            date: new Date().toISOString().split('T')[0],
            description,
            amount: parseFloat(amount),
            type,
            category,
            status: TransactionStatus.Completed,
            receiptUrl: receiptPreview || undefined,
        };
        addTransaction(newTransaction);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="receipt" className="block text-sm font-medium text-neutral-700">Upload Receipt (Optional)</label>
                <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                         {receiptPreview ? (
                            <img src={receiptPreview} alt="Receipt preview" className="mx-auto h-24 w-auto object-contain"/>
                         ) : (
                             <svg className="mx-auto h-12 w-12 text-neutral-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                         )}
                        <div className="flex text-sm text-neutral-600">
                            <label htmlFor="receipt-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-accent hover:text-secondary focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="receipt-upload" name="receipt-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-neutral-500">PNG, JPG up to 10MB</p>
                    </div>
                </div>
                 {isAnalyzing && <p className="text-sm text-center text-neutral-600 animate-pulse mt-2">Analyzing receipt...</p>}
            </div>

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
                <div className="flex items-center space-x-2 mt-1">
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value as any)} className="block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent">
                        {TRANSACTION_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                    <button type="button" onClick={handleSuggestCategory} disabled={isSuggesting || !description} className="px-3 py-2 bg-secondary text-white rounded-md hover:bg-primary disabled:bg-neutral-300 flex items-center justify-center">
                       {isSuggesting ? (
                         <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                       ) : (
                         ICONS.Spark
                       )}
                    </button>
                </div>
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
