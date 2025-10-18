export type View = 'Dashboard' | 'Transactions' | 'Invoices' | 'Reports' | 'Bills';

export enum TransactionStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed',
}

export enum InvoiceStatus {
  Draft = 'Draft',
  Sent = 'Sent',
  Paid = 'Paid',
  Overdue = 'Overdue',
}

export enum BillStatus {
  Due = 'Due',
  Paid = 'Paid',
  Overdue = 'Overdue',
}

export const TRANSACTION_CATEGORIES = [
  "Sales", "Cost of Goods Sold", "Advertising", "Office Supplies", "Rent", 
  "Utilities", "Travel", "Software", "Salaries", "Contractors", "Other"
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: TransactionCategory;
  status: TransactionStatus;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
}

export interface Bill {
  id: string;
  vendorName: string;
  description: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: BillStatus;
}

export interface BookkeepingContextType {
  transactions: Transaction[];
  invoices: Invoice[];
  bills: Bill[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  updateBillStatus: (id: string, status: BillStatus) => void;
}