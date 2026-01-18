"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Get initial user
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const navLinks = [
        { href: '/fianance', label: 'Dashboard' },
        { href: '/fianance/upload', label: 'Upload' },
        { href: '/fianance/transactions', label: 'Transactions' },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    return (
        <nav className="border-b border-zinc-800 bg-black sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl grayscale">💰</span>
                            <span className="text-xl font-bold text-white tracking-tight">
                                SpendTracker
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="flex items-center gap-4">
                        {!loading && user ? (
                            <>
                                <div className="hidden md:flex items-center space-x-1 mr-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href
                                                ? 'bg-zinc-800 text-white'
                                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* User Menu */}
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-zinc-400 hidden md:block">
                                        {user.email}
                                    </span>
                                    <button
                                        onClick={handleSignOut}
                                        className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : !loading ? (
                            <>
                                <Link href="/login">
                                    <button className="text-zinc-300 hover:text-white transition-colors mr-4">
                                        Sign In
                                    </button>
                                </Link>
                                <Link href="/login">
                                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium">
                                        Get Started
                                    </button>
                                </Link>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
            {/* Mobile Navigation */}
            {user && (
                <div className="md:hidden border-t border-zinc-800 px-2 py-2 flex justify-around">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3 py-2 rounded-lg text-xs font-medium ${pathname === link.href
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-500'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}
