import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, Invoice, Bill, BookkeepingContextType, TransactionStatus, InvoiceStatus, BillStatus } from '../types';

const BookkeepingContext = createContext<BookkeepingContextType | undefined>(undefined);

const initialTransactions: Transaction[] = [
    { id: '1', date: '2023-10-26', description: 'Web hosting services', amount: 75.00, type: 'Expense', category: 'Software', status: TransactionStatus.Completed },
    { id: '2', date: '2023-10-25', description: 'Client payment - Project Alpha', amount: 2500.00, type: 'Income', category: 'Sales', status: TransactionStatus.Completed },
    { id: '3', date: '2023-10-24', description: 'Office coffee and snacks', amount: 45.50, type: 'Expense', category: 'Office Supplies', status: TransactionStatus.Completed },
    { id: '4', date: '2023-10-22', description: 'Flight to conference', amount: 450.80, type: 'Expense', category: 'Travel', status: TransactionStatus.Pending },
    { id: '5', date: '2023-10-21', description: 'Client payment - Project Beta', amount: 1800.00, type: 'Income', category: 'Sales', status: TransactionStatus.Completed },
];

const initialInvoices: Invoice[] = [
    { id: '1', invoiceNumber: 'INV-001', clientName: 'Innovate Corp', clientEmail: 'contact@innovate.com', issueDate: '2023-10-15', dueDate: '2023-10-30', items: [{ description: 'Q4 Consulting', quantity: 1, price: 5000 }], status: InvoiceStatus.Sent },
    { id: '2', invoiceNumber: 'INV-002', clientName: 'Solutions Inc', clientEmail: 'accounts@solutions.com', issueDate: '2023-10-10', dueDate: '2023-10-25', items: [{ description: 'Web Development', quantity: 1, price: 3500 }], status: InvoiceStatus.Paid },
    { id: '3', invoiceNumber: 'INV-003', clientName: 'Creative LLC', clientEmail: 'billing@creative.co', issueDate: '2023-10-20', dueDate: '2023-11-05', items: [{ description: 'Logo Design', quantity: 1, price: 1200 }], status: InvoiceStatus.Draft },
];

const initialBills: Bill[] = [
    { id: '1', vendorName: 'Cloudly Inc.', description: 'Monthly server costs', amount: 250.00, issueDate: '2023-10-05', dueDate: '2023-10-20', status: BillStatus.Paid },
    { id: '2', vendorName: 'OfficeMart', description: 'New office chairs', amount: 850.00, issueDate: '2023-10-12', dueDate: '2023-10-27', status: BillStatus.Due },
    { id: '3', vendorName: 'DesignTool Co.', description: 'Annual software license', amount: 600.00, issueDate: '2023-09-25', dueDate: '2023-10-10', status: BillStatus.Overdue },
];

export const BookkeepingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
    const [bills, setBills] = useState<Bill[]>(initialBills);

    const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            id: (transactions.length + 1).toString(),
            ...transaction,
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const addInvoice = (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
        const newInvoice: Invoice = {
            id: (invoices.length + 1).toString(),
            invoiceNumber: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
            ...invoice,
        };
        setInvoices(prev => [newInvoice, ...prev]);
    };

    const addBill = (bill: Omit<Bill, 'id'>) => {
        const newBill: Bill = {
            id: (bills.length + 1).toString(),
            ...bill,
        };
        setBills(prev => [newBill, ...prev]);
    }

    const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
    }

    const updateBillStatus = (id: string, status: BillStatus) => {
        setBills(prev => prev.map(bill => bill.id === id ? { ...bill, status } : bill));
    }

    return (
        <BookkeepingContext.Provider value={{ transactions, invoices, bills, addTransaction, addInvoice, addBill, updateInvoiceStatus, updateBillStatus }}>
            {children}
        </BookkeepingContext.Provider>
    );
};

export const useBookkeeping = (): BookkeepingContextType => {
    const context = useContext(BookkeepingContext);
    if (context === undefined) {
        throw new Error('useBookkeeping must be used within a BookkeepingProvider');
    }
    return context;
};