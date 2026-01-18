'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import FileUpload from '@/components/fianance/FileUpload';

const BANKS = ['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Other'];
const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Rent', 'Salary', 'Investment', 'Transfer', 'Other'];

export default function UploadPage() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState<'pdf' | 'sms' | 'manual'>('pdf');
    const [bankName, setBankName] = useState('Other');
    const [smsText, setSmsText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    // Manual entry state
    const [manualType, setManualType] = useState<'credit' | 'debit'>('debit');
    const [manualAmount, setManualAmount] = useState('');
    const [manualDescription, setManualDescription] = useState('');
    const [manualCategory, setManualCategory] = useState('Other');
    const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
            } else {
                router.push('/login');
            }
            setIsLoaded(true);
        });
    }, [router, supabase]);

    const handlePDFUpload = async (file: File) => {
        setIsUploading(true);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bankName', bankName);

            const response = await fetch('/api/fianance/upload/pdf', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResult({ success: true, message: data.message });
            } else {
                setResult({ success: false, message: data.error || 'Upload failed' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Upload failed. Please try again.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualAmount || !manualDescription) return;

        setIsUploading(true);
        setResult(null);

        try {
            const response = await fetch('/api/fianance/transactions', {
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
            } else {
                setResult({ success: false, message: data.error || 'Failed to add transaction' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Failed to add transaction. Please try again.' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleSMSSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!smsText.trim()) return;

        setIsUploading(true);
        setResult(null);

        try {
            const response = await fetch('/api/fianance/upload/sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ smsText, bankName }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({ success: true, message: data.message });
                setSmsText('');
            } else {
                setResult({ success: false, message: data.error || 'Processing failed' });
            }
        } catch (error) {
            setResult({ success: false, message: 'Processing failed. Please try again.' });
        } finally {
            setIsUploading(false);
        }
    };

    if (!isLoaded || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 bg-black min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-white">Upload Transactions</h1>
                <p className="text-zinc-500">Import your bank statement or paste SMS messages</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('pdf')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'pdf'
                        ? 'bg-white text-black font-semibold'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                        }`}
                >
                    📄 PDF Statement
                </button>
                <button
                    onClick={() => setActiveTab('sms')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'sms'
                        ? 'bg-white text-black font-semibold'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                        }`}
                >
                    💬 SMS Text
                </button>
                <button
                    onClick={() => setActiveTab('manual')}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'manual'
                        ? 'bg-white text-black font-semibold'
                        : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                        }`}
                >
                    💰 Manual
                </button>
            </div>

            {/* Bank Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Select Bank
                </label>
                <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                    {BANKS.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                    ))}
                </select>
            </div>

            {/* Result Message */}
            {result && (
                <div className={`mb-6 p-4 rounded-lg border ${result.success
                    ? 'bg-zinc-900 border-zinc-700 text-white'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                    }`}>
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{result.success ? '✅' : '❌'}</span>
                        <p>{result.message}</p>
                    </div>
                    {result.success && (
                        <button
                            onClick={() => {
                                // Force a full page navigation to ensure dashboard refetches data
                                window.location.href = '/fianance';
                            }}
                            className="mt-2 text-sm underline hover:text-zinc-300 ml-8"
                        >
                            Go to Dashboard →
                        </button>
                    )}
                </div>
            )}

            {/* Upload Area */}
            <div className="bg-zinc-900/30 rounded-2xl p-6 border border-zinc-800">
                {activeTab === 'pdf' ? (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Upload Bank Statement PDF</h3>
                        <FileUpload
                            onFileSelect={handlePDFUpload}
                            accept=".pdf"
                            maxSize={10 * 1024 * 1024}
                            label="Drop your bank statement here"
                            description="Supports HDFC, SBI, ICICI and other banks"
                            isLoading={isUploading}
                        />
                        <div className="mt-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                            <h4 className="text-sm font-medium text-zinc-300 mb-2">Supported formats:</h4>
                            <ul className="text-zinc-500 text-sm space-y-1">
                                <li>• HDFC Bank account statements</li>
                                <li>• SBI account statements</li>
                                <li>• ICICI Bank statements</li>
                                <li>• Other bank PDF statements</li>
                            </ul>
                        </div>
                    </div>
                ) : activeTab === 'sms' ? (
                    <form onSubmit={handleSMSSubmit}>
                        <h3 className="text-lg font-semibold mb-4 text-white">Paste SMS Messages</h3>
                        <textarea
                            value={smsText}
                            onChange={(e) => setSmsText(e.target.value)}
                            placeholder={`Paste your bank SMS messages here...
    
Example:
Rs.500.00 debited from A/C XXXX1234 at SWIGGY on 01-01-2024. Avl Bal Rs.25,000.00

You can paste multiple SMS messages, each on a new line.`}
                            className="w-full h-48 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none font-mono"
                        />
                        <button
                            type="submit"
                            disabled={isUploading || !smsText.trim()}
                            className="mt-4 w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? 'Processing...' : 'Parse SMS'}
                        </button>
                        <div className="mt-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                            <h4 className="text-sm font-medium text-zinc-300 mb-2">Supported SMS formats:</h4>
                            <ul className="text-zinc-500 text-sm space-y-1">
                                <li>• Rs XXX debited from A/C at MERCHANT</li>
                                <li>• UPI payment of Rs XXX to MERCHANT</li>
                                <li>• Your A/c credited with Rs XXX</li>
                            </ul>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4 text-white">Add Transaction Manually</h3>

                        {/* Type Toggle */}
                        <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
                            <button
                                type="button"
                                onClick={() => setManualType('debit')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${manualType === 'debit'
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    : 'text-zinc-400 hover:text-zinc-300'
                                    }`}
                            >
                                💸 Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setManualType('credit')}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${manualType === 'credit'
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : 'text-zinc-400 hover:text-zinc-300'
                                    }`}
                            >
                                💰 Income
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">
                                    Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">₹</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={manualAmount}
                                        onChange={(e) => setManualAmount(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={manualDate}
                                    onChange={(e) => setManualDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 [color-scheme:dark]"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">
                                Description
                            </label>
                            <input
                                type="text"
                                value={manualDescription}
                                onChange={(e) => setManualDescription(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                                placeholder={manualType === 'credit' ? "e.g., Salary, Refund" : "e.g., Grocery at Walmart, Uber Ride"}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">
                                Category
                            </label>
                            <select
                                value={manualCategory}
                                onChange={(e) => setManualCategory(e.target.value)}
                                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={isUploading || !manualAmount || !manualDescription}
                            className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${manualType === 'credit'
                                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                : 'bg-white hover:bg-zinc-200 text-black'
                                }`}
                        >
                            {isUploading ? 'Adding...' : manualType === 'credit' ? 'Add Income' : 'Add Expense'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
