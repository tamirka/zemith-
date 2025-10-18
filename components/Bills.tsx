import React, { useState } from 'react';
import Card from './common/Card';
import Modal from './common/Modal';
import { useBookkeeping } from '../hooks/useBookkeeping';
import { Bill, BillStatus } from '../types';

const statusColors: { [key in BillStatus]: string } = {
  [BillStatus.Paid]: 'bg-green-100 text-green-800',
  [BillStatus.Due]: 'bg-yellow-100 text-yellow-800',
  [BillStatus.Overdue]: 'bg-red-100 text-red-800',
};

const BillRow: React.FC<{ bill: Bill }> = ({ bill }) => {
    const { updateBillStatus } = useBookkeeping();
    return (
        <tr className="border-b border-neutral-200 hover:bg-neutral-50">
            <td className="py-3 px-4 text-neutral-800 font-medium">{bill.vendorName}</td>
            <td className="py-3 px-4 text-neutral-700">{bill.description}</td>
            <td className="py-3 px-4 text-neutral-600">{bill.issueDate}</td>
            <td className="py-3 px-4 text-neutral-600">{bill.dueDate}</td>
            <td className="py-3 px-4 font-semibold text-neutral-800">${bill.amount.toFixed(2)}</td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[bill.status]}`}>
                    {bill.status}
                </span>
            </td>
            <td className="py-3 px-4 text-right">
                {bill.status !== BillStatus.Paid && (
                    <button onClick={() => updateBillStatus(bill.id, BillStatus.Paid)} className="text-sm font-semibold text-accent hover:text-secondary">
                        Mark as Paid
                    </button>
                )}
            </td>
        </tr>
    );
};

const BillCard: React.FC<{ bill: Bill }> = ({ bill }) => {
  const { updateBillStatus } = useBookkeeping();
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-neutral-800">{bill.vendorName}</p>
          <p className="text-sm text-neutral-600">{bill.description}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[bill.status]}`}>
          {bill.status}
        </span>
      </div>
      <div className="mt-4 flex justify-between items-end">
        <div>
          <p className="text-sm text-neutral-500">Issued: {bill.issueDate}</p>
          <p className="text-sm text-neutral-500">Due: {bill.dueDate}</p>
        </div>
        <p className="text-lg font-bold text-neutral-800">${bill.amount.toFixed(2)}</p>
      </div>
       {bill.status !== BillStatus.Paid && (
          <div className="mt-3 pt-3 border-t text-right">
              <button onClick={() => updateBillStatus(bill.id, BillStatus.Paid)} className="px-3 py-1 text-sm bg-accent text-white font-semibold rounded-md hover:bg-secondary">
                  Mark as Paid
              </button>
          </div>
        )}
    </div>
  );
};


const NewBillForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { addBill } = useBookkeeping();
    const [vendorName, setVendorName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addBill({
            vendorName,
            description,
            amount: parseFloat(amount),
            issueDate: new Date().toISOString().split('T')[0],
            dueDate,
            status: BillStatus.Due,
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-neutral-700">Vendor Name</label>
                <input type="text" value={vendorName} onChange={e => setVendorName(e.target.value)} required className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700">Description</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"/>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Amount</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Due Date</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"/>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-secondary">Add Bill</button>
            </div>
        </form>
    );
}

const Bills: React.FC = () => {
    const { bills } = useBookkeeping();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">Bills</h2>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-secondary transition-colors w-full md:w-auto">
                    Add Bill
                </button>
            </div>
        
            <div className="hidden md:block">
              <Card>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="border-b-2 border-neutral-200">
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Vendor</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Description</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Issued</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Due</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Amount</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Status</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {bills.map(b => <BillRow key={b.id} bill={b} />)}
                          </tbody>
                      </table>
                  </div>
              </Card>
            </div>

            <div className="md:hidden">
              {bills.map(b => <BillCard key={b.id} bill={b} />)}
            </div>

            {/* Fix: Corrected typo from setIsModal-Open to setIsModalOpen */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add a New Bill">
                <NewBillForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Bills;