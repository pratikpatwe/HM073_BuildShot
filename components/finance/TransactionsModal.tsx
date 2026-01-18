"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/finance/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import TransactionList from '@/components/finance/TransactionList';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Rent', 'Salary', 'Investment', 'Transfer', 'Other'];

interface TransactionsModalProps {
    onDeleteSuccess?: () => void;
    trigger?: React.ReactNode;
}

export function TransactionsModal({ onDeleteSuccess, trigger }: TransactionsModalProps) {
    const [open, setOpen] = useState(false);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0,
    });

    // Filters
    const [category, setCategory] = useState('All');
    const [type, setType] = useState<'all' | 'credit' | 'debit'>('all');
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    useEffect(() => {
        if (open) {
            fetchTransactions();
        }
    }, [open, pagination.page, category, type, search, sortOrder]);

    const fetchTransactions = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                sortBy: 'date',
                sortOrder,
            });

            if (category !== 'All') params.append('category', category);
            if (type !== 'all') params.append('type', type);
            if (search) params.append('search', search);

            const response = await fetch(`/api/finance/transactions?${params}`);

            if (response.ok) {
                const data = await response.json();
                setTransactions(data.transactions);
                setPagination(prev => ({
                    ...prev,
                    total: data.pagination.total,
                    totalPages: data.pagination.totalPages,
                }));
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Delete ${ids.length} transaction(s)?`)) return;

        try {
            const response = await fetch('/api/finance/transactions', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactionIds: ids }),
            });

            if (response.ok) {
                fetchTransactions();
                onDeleteSuccess?.();
            }
        } catch (error) {
            console.error('Failed to delete transactions:', error);
        }
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-1 h-8 px-2 text-xs uppercase font-bold tracking-widest">
                        View All
                        <ArrowUpRight className="w-4 h-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-[#0B0B0B] border border-white/5 sm:max-w-[1000px] max-h-[90vh] rounded-3xl overflow-hidden p-0 shadow-2xl flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/5 via-white/10 to-white/5"></div>

                <div className="p-8 flex-1 overflow-hidden flex flex-col">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-3xl font-bold text-white tracking-tight uppercase">All Transactions</DialogTitle>
                        <p className="text-zinc-500 text-sm mt-1">View, filter and manage your transaction history.</p>
                    </DialogHeader>

                    {/* Filters Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search merchant..."
                                className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl">
                            <Filter className="w-4 h-4 text-zinc-500" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="bg-transparent text-white text-sm focus:outline-none w-full cursor-pointer uppercase font-bold tracking-tight text-[10px]"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat} className="bg-[#0b0b0b]">{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl">
                            <ArrowUpDown className="w-4 h-4 text-zinc-500" />
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value as any)}
                                className="bg-transparent text-white text-sm focus:outline-none w-full cursor-pointer uppercase font-bold tracking-tight text-[10px]"
                            >
                                <option value="all" className="bg-[#0b0b0b]">All Types</option>
                                <option value="credit" className="bg-[#0b0b0b]">Income</option>
                                <option value="debit" className="bg-[#0b0b0b]">Expense</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl">
                            <ArrowUpDown className="w-4 h-4 text-zinc-500" />
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as any)}
                                className="bg-transparent text-white text-sm focus:outline-none w-full cursor-pointer uppercase font-bold tracking-tight text-[10px]"
                            >
                                <option value="desc" className="bg-[#0b0b0b]">Newest First</option>
                                <option value="asc" className="bg-[#0b0b0b]">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Transaction List Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-10 h-10 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                                <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Loading Transactions...</p>
                            </div>
                        ) : (
                            <TransactionList
                                transactions={transactions}
                                onDelete={handleDelete}
                                showPagination={true}
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
