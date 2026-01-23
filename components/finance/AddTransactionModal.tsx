"use client";

import { useState } from 'react';
import { Plus, X, FileText, MessageSquare, PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/finance/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import FileUpload from '@/components/finance/FileUpload';
import { cn } from '@/lib/utils';

const BANKS = ['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Other'];
const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Rent', 'Salary', 'Investment', 'Transfer', 'Other'];

interface AddTransactionModalProps {
    onSuccess?: () => void;
    trigger?: React.ReactNode;
}

export function AddTransactionModal({ onSuccess, trigger }: AddTransactionModalProps) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'pdf' | 'sms' | 'manual'>('pdf');
    const [bankName, setBankName] = useState('Other');
    const [smsText, setSmsText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    // Manual entry state
    const [manualType, setManualType] = useState<'credit' | 'debit'>('debit');
    const [manualAmount, setManualAmount] = useState('');
    const [manualDescription, setManualDescription] = useState('');
    const [manualCategory, setManualCategory] = useState('Other');
    const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);

    const steps = [
        "Reading File...",
        "Parsing Transactions...",
        "Calculating Insights...",
        "Finalizing Data..."
    ];

    const startLoadingSteps = () => {
        setIsUploading(true);
        setLoadingStep(0);
        const interval = setInterval(() => {
            setLoadingStep(prev => {
                if (prev < 2) return prev + 1; // Progress fast to 'Parsing...'
                return prev;
            });
        }, 800);
        return interval;
    };

    const handlePDFUpload = async (file: File) => {
        const interval = startLoadingSteps();
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bankName', bankName);

            const response = await fetch('/api/finance/upload/pdf', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setLoadingStep(3); // Jump to final step
                setResult({ success: true, message: data.message });
                onSuccess?.();
            } else {
                setResult({ success: false, message: data.error || 'Upload failed' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Upload failed. Please try again.' });
        } finally {
            clearInterval(interval);
            setIsUploading(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualAmount || !manualDescription) return;

        const interval = startLoadingSteps();
        setResult(null);

        try {
            const response = await fetch('/api/finance/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: manualType,
                    amount: parseFloat(manualAmount),
                    description: manualDescription,
                    category: manualCategory,
                    date: manualDate || new Date(),
                    bankName: bankName === 'Other' ? 'Manual Cash' : bankName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setLoadingStep(3);
                const formattedAmount = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                }).format(parseFloat(manualAmount));

                setResult({
                    success: true,
                    message: `${manualType === 'credit' ? 'Income' : 'Expense'} of ${formattedAmount} added successfully!`
                });
                // Reset form
                setManualAmount('');
                setManualDescription('');
                setManualCategory('Other');
                onSuccess?.();
            } else {
                setResult({ success: false, message: data.error || 'Failed to add transaction' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Failed to add transaction. Please try again.' });
        } finally {
            clearInterval(interval);
            setIsUploading(false);
        }
    };

    const handleSMSSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!smsText.trim()) return;

        const interval = startLoadingSteps();
        setResult(null);

        try {
            const response = await fetch('/api/finance/upload/sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ smsText, bankName }),
            });

            const data = await response.json();

            if (response.ok) {
                setLoadingStep(3);
                setResult({ success: true, message: data.message });
                setSmsText('');
                onSuccess?.();
            } else {
                setResult({ success: false, message: data.error || 'Processing failed' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Processing failed. Please try again.' });
        } finally {
            clearInterval(interval);
            setIsUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="lg" className="gap-2 px-4 border-zinc-700 hover:bg-zinc-800 text-white hover:text-white uppercase text-[11px] font-bold tracking-widest cursor-pointer rounded-xl">
                        <Plus className="w-4 h-4" />
                        Add
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-[#0B0B0B] border border-white/5 sm:max-w-[500px] rounded-3xl overflow-hidden p-0 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 via-white/5 to-white/5"></div>

                <div className="p-6">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-3xl font-bold text-white tracking-tight uppercase">Add Transactions</DialogTitle>
                        <DialogDescription className="sr-only">
                            Form to add financial transactions via PDF upload, SMS parsing, or manual entry.
                        </DialogDescription>
                        <p className="text-zinc-500 text-sm mt-1">Import bank statement, SMS, or enter manually.</p>
                    </DialogHeader>

                    {/* Tabs */}
                    <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-2xl gap-1 mb-8">
                        {[
                            { id: 'pdf', icon: FileText, label: 'PDF' },
                            { id: 'sms', icon: MessageSquare, label: 'SMS' },
                            { id: 'manual', icon: PlusCircle, label: 'Manual' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id as any);
                                    setResult(null);
                                }}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer",
                                    activeTab === tab.id
                                        ? "bg-white text-black shadow-lg"
                                        : "text-zinc-500 hover:text-white"
                                )}
                            >
                                <tab.icon className="w-3.5 h-3.5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Form Context */}
                    <div className="space-y-6">
                        {/* Common Bank Selection for PDF/SMS */}
                        {activeTab !== 'manual' && (
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Select Bank</label>
                                <select
                                    value={bankName}
                                    onChange={(e) => setBankName(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 cursor-pointer text-sm"
                                >
                                    {BANKS.map((bank) => (
                                        <option key={bank} value={bank} className="bg-[#141414]">{bank}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Result Message */}
                        {result && (
                            <div className={cn(
                                "p-4 rounded-2xl border text-sm transition-all animate-in fade-in slide-in-from-top-2",
                                result.success
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-red-500/10 border-red-500/20 text-red-400"
                            )}>
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{result.success ? '✅' : '❌'}</span>
                                    <p className="font-medium">{result.message}</p>
                                </div>
                            </div>
                        )}

                        {/* Tab Content */}
                        <div className="min-h-[220px]">
                            {activeTab === 'pdf' && (
                                <FileUpload
                                    onFileSelect={handlePDFUpload}
                                    accept=".pdf"
                                    maxSize={10 * 1024 * 1024}
                                    label="Drop statement here"
                                    description="Supports HDFC, SBI, ICICI..."
                                    isLoading={isUploading}
                                    loadingStep={loadingStep}
                                    steps={steps}
                                />
                            )}

                            {activeTab === 'sms' && (
                                <form onSubmit={handleSMSSubmit} className="space-y-4">
                                    <textarea
                                        value={smsText}
                                        onChange={(e) => setSmsText(e.target.value)}
                                        placeholder="Paste bank SMS messages here..."
                                        className="w-full h-32 px-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 resize-none font-mono text-sm"
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isUploading || !smsText.trim()}
                                        className="w-full py-6 bg-white text-black font-bold uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isUploading ? steps[loadingStep] : 'Process SMS'}
                                    </Button>
                                </form>
                            )}

                            {activeTab === 'manual' && (
                                <form onSubmit={handleManualSubmit} className="space-y-5">
                                    <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => setManualType('debit')}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-widest cursor-pointer",
                                                manualType === 'debit' ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-zinc-500 hover:text-zinc-400"
                                            )}
                                        >
                                            💸 Expense
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setManualType('credit')}
                                            className={cn(
                                                "flex-1 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-widest cursor-pointer",
                                                manualType === 'credit' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "text-zinc-500 hover:text-zinc-400"
                                            )}
                                        >
                                            💰 Income
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Amount</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    value={manualAmount}
                                                    onChange={(e) => setManualAmount(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Date</label>
                                            <input
                                                type="date"
                                                value={manualDate}
                                                onChange={(e) => setManualDate(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 [color-scheme:dark] cursor-pointer"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Description</label>
                                        <input
                                            type="text"
                                            value={manualDescription}
                                            onChange={(e) => setManualDescription(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                                            placeholder={manualType === 'credit' ? "What's the source?" : "Where did you spend?"}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Category</label>
                                        <select
                                            value={manualCategory}
                                            onChange={(e) => setManualCategory(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/30 cursor-pointer"
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <option key={cat} value={cat} className="bg-[#141414]">{cat}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={isUploading || !manualAmount || !manualDescription}
                                        className={cn(
                                            "w-full py-6 font-bold uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2",
                                            manualType === 'credit' ? "bg-emerald-500 hover:bg-emerald-600 text-black" : "bg-white text-black hover:bg-zinc-200"
                                        )}
                                    >
                                        {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isUploading ? steps[loadingStep] : `Add ${manualType === 'credit' ? 'Income' : 'Expense'}`}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
