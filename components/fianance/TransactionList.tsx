'use client';

import { useState } from 'react';

interface Transaction {
    _id: string;
    date: string;
    amount: number;
    type: 'credit' | 'debit';
    merchant: string;
    rawDescription: string;
    category: string;
    channel: string;
    accountId?: {
        bankName: string;
    };
}

interface TransactionListProps {
    transactions: Transaction[];
    onDelete?: (ids: string[]) => void;
    showPagination?: boolean;
    pagination?: {
        page: number;
        totalPages: number;
        total: number;
    };
    onPageChange?: (page: number) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
    'Food': '🍔',
    'Travel': '✈️',
    'Shopping': '🛒',
    'Entertainment': '🎬',
    'Bills': '📄',
    'Health': '🏥',
    'Education': '📚',
    'Rent': '🏠',
    'Salary': '💰',
    'Investment': '📈',
    'Transfer': '↔️',
    'Other': '📦',
};

export default function TransactionList({
    transactions,
    onDelete,
    showPagination = false,
    pagination,
    onPageChange,
}: TransactionListProps) {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleAll = () => {
        if (selectedIds.size === transactions.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(transactions.map(t => t._id)));
        }
    };

    const handleDelete = () => {
        if (onDelete && selectedIds.size > 0) {
            onDelete(Array.from(selectedIds));
            setSelectedIds(new Set());
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatAmount = (amount: number, type: 'credit' | 'debit') => {
        const prefix = type === 'credit' ? '+' : '-';
        return `${prefix}₹${amount.toLocaleString('en-IN')}`;
    };

    if (transactions.length === 0) {
        return (
            <div className="text-center py-20 text-zinc-500">
                <div className="text-4xl mb-4 grayscale">📭</div>
                <p className="text-xs uppercase font-bold tracking-widest">No transactions found</p>
            </div>
        );
    }

    return (
        <div>
            {/* Bulk Actions */}
            {onDelete && selectedIds.size > 0 && (
                <div className="mb-6 p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <span className="text-zinc-400 text-sm font-medium">
                        {selectedIds.size} transaction(s) selected
                    </span>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 text-xs uppercase font-bold tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all cursor-pointer"
                    >
                        Delete Selected
                    </button>
                </div>
            )}

            {/* Transaction Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            {onDelete && (
                                <th className="py-4 px-4 text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === transactions.length}
                                        onChange={toggleAll}
                                        className="rounded border-white/10 bg-white/5 text-white focus:ring-zinc-500 cursor-pointer w-4 h-4"
                                    />
                                </th>
                            )}
                            <th className="py-4 px-4 text-left text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Date</th>
                            <th className="py-4 px-4 text-left text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Merchant</th>
                            <th className="py-4 px-4 text-left text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Category</th>
                            <th className="py-4 px-4 text-left text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Channel</th>
                            <th className="py-4 px-4 text-right text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr
                                key={txn._id}
                                className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                            >
                                {onDelete && (
                                    <td className="py-4 px-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(txn._id)}
                                            onChange={() => toggleSelection(txn._id)}
                                            className="rounded border-white/10 bg-white/5 text-white focus:ring-zinc-500 cursor-pointer w-4 h-4"
                                        />
                                    </td>
                                )}
                                <td className="py-4 px-4 text-zinc-400 text-sm font-medium">
                                    {formatDate(txn.date)}
                                </td>
                                <td className="py-4 px-4">
                                    <div>
                                        <p className="text-white font-bold text-sm tracking-tight">{txn.merchant}</p>
                                        <p className="text-zinc-500 text-[11px] truncate max-w-[250px] mt-0.5" title={txn.rawDescription}>
                                            {txn.rawDescription}
                                        </p>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                                        <span>{CATEGORY_ICONS[txn.category] || '📦'}</span>
                                        <span>{txn.category}</span>
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest">{txn.channel}</span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <span
                                        className={`font-semibold ${txn.type === 'credit' ? 'text-white' : 'text-zinc-400'}`}
                                    >
                                        {formatAmount(txn.amount, txn.type)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                        Showing {((pagination.page - 1) * 50) + 1} - {Math.min(pagination.page * 50, pagination.total)} of {pagination.total}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange?.(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/5 text-zinc-400 rounded-xl hover:bg-white/10 disabled:opacity-30 transition-all cursor-pointer"
                        >
                            Prev
                        </button>
                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-white text-black rounded-xl">
                            {pagination.page} / {pagination.totalPages}
                        </div>
                        <button
                            onClick={() => onPageChange?.(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/5 text-zinc-400 rounded-xl hover:bg-white/10 disabled:opacity-30 transition-all cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
