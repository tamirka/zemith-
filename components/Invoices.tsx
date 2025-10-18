import React, { useState } from 'react';
import Card from './common/Card';
import Modal from './common/Modal';
import { useBookkeeping } from '../hooks/useBookkeeping';
import { Invoice, InvoiceStatus, InvoiceItem } from '../types';

const statusColors: { [key in InvoiceStatus]: string } = {
  [InvoiceStatus.Paid]: 'bg-green-100 text-green-800',
  [InvoiceStatus.Sent]: 'bg-blue-100 text-blue-800',
  [InvoiceStatus.Overdue]: 'bg-red-100 text-red-800',
  [InvoiceStatus.Draft]: 'bg-neutral-100 text-neutral-800',
};

const InvoiceRow: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const { updateInvoiceStatus } = useBookkeeping();
    const total = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    return (
        <tr className="border-b border-neutral-200 hover:bg-neutral-50">
            <td className="py-3 px-4 text-neutral-800 font-medium">{invoice.invoiceNumber}</td>
            <td className="py-3 px-4 text-neutral-700">{invoice.clientName}</td>
            <td className="py-3 px-4 text-neutral-600">{invoice.issueDate}</td>
            <td className="py-3 px-4 text-neutral-600">{invoice.dueDate}</td>
            <td className="py-3 px-4 font-semibold text-neutral-800">${total.toFixed(2)}</td>
            <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[invoice.status]}`}>
                    {invoice.status}
                </span>
            </td>
            <td className="py-3 px-4 text-right">
                {invoice.status === InvoiceStatus.Draft && (
                    <button onClick={() => updateInvoiceStatus(invoice.id, InvoiceStatus.Sent)} className="text-sm font-semibold text-accent hover:text-secondary">
                        Send
                    </button>
                )}
            </td>
        </tr>
    );
};

const InvoiceCard: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const { updateInvoiceStatus } = useBookkeeping();
  const total = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-neutral-800">{invoice.clientName}</p>
          <p className="text-sm text-neutral-600">{invoice.invoiceNumber}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[invoice.status]}`}>
          {invoice.status}
        </span>
      </div>
      <div className="mt-4 flex justify-between items-end">
        <div>
          <p className="text-sm text-neutral-500">Issued: {invoice.issueDate}</p>
          <p className="text-sm text-neutral-500">Due: {invoice.dueDate}</p>
        </div>
        <p className="text-lg font-bold text-neutral-800">${total.toFixed(2)}</p>
      </div>
       {invoice.status === InvoiceStatus.Draft && (
          <div className="mt-3 pt-3 border-t text-right">
              <button onClick={() => updateInvoiceStatus(invoice.id, InvoiceStatus.Sent)} className="px-3 py-1 text-sm bg-accent text-white font-semibold rounded-md hover:bg-secondary">
                  Send Invoice
              </button>
          </div>
        )}
    </div>
  );
};


const NewInvoiceForm: React.FC<{onClose: () => void}> = ({onClose}) => {
    const { addInvoice } = useBookkeeping();
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([{description: '', quantity: 1, price: 0}]);

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, {description: '', quantity: 1, price: 0}]);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addInvoice({
            clientName,
            clientEmail,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate,
            items,
            status: InvoiceStatus.Draft
        });
        onClose();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-neutral-700">Client Name</label>
                    <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} required className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-neutral-700">Client Email</label>
                    <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} required className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-neutral-700">Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-accent focus:border-accent"/>
            </div>
            <h4 className="text-lg font-medium text-neutral-800 pt-2 border-t">Invoice Items</h4>
            {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="col-span-12 sm:col-span-6 border border-neutral-300 rounded-md py-1 px-2" />
                    <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value))} className="col-span-4 sm:col-span-2 border border-neutral-300 rounded-md py-1 px-2" />
                    <input type="number" placeholder="Price" value={item.price} onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))} className="col-span-4 sm:col-span-2 border border-neutral-300 rounded-md py-1 px-2" />
                    <div className="col-span-4 sm:col-span-2 text-right font-medium">${(item.quantity * item.price).toFixed(2)}</div>
                </div>
            ))}
            <button type="button" onClick={addItem} className="text-sm text-accent font-semibold">+ Add Item</button>
            <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-secondary">Save Draft</button>
            </div>
        </form>
    );
}

const Invoices: React.FC = () => {
    const { invoices } = useBookkeeping();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-800">Invoices</h2>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-secondary transition-colors w-full md:w-auto">
                    New Invoice
                </button>
            </div>
        
            <div className="hidden md:block">
              <Card>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="border-b-2 border-neutral-200">
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Number</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Client</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Issued</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Due</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Total</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600">Status</th>
                                  <th className="py-3 px-4 font-semibold text-neutral-600 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody>
                              {invoices.map(i => <InvoiceRow key={i.id} invoice={i} />)}
                          </tbody>
                      </table>
                  </div>
              </Card>
            </div>

            <div className="md:hidden">
              {invoices.map(i => <InvoiceCard key={i.id} invoice={i} />)}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Invoice">
                <NewInvoiceForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default Invoices;
