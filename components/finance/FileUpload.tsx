'use client';

import { useState, useRef, DragEvent } from 'react';
import { Wallet, CheckCircle2, Circle, Loader2, FileUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number;
    label?: string;
    description?: string;
    isLoading?: boolean;
    loadingStep?: number;
    steps?: string[];
}

export default function FileUpload({
    onFileSelect,
    accept = '.pdf',
    maxSize = 10 * 1024 * 1024, // 10MB default
    label = 'Upload File',
    description = 'Drag and drop or click to browse',
    isLoading = false,
    loadingStep = 0,
    steps = [],
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file: File) => {
        setError(null);

        // Check file size
        if (file.size > maxSize) {
            setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
            return;
        }

        // Check file type
        const acceptedTypes = accept.split(',').map(t => t.trim());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isAccepted = acceptedTypes.some(
            type => type === fileExtension || type === file.type || type === '*'
        );

        if (!isAccepted) {
            setError(`Please upload a valid file (${accept})`);
            return;
        }

        setSelectedFile(file);
        onFileSelect(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        setError(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <div
                onClick={() => !isLoading && inputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-3xl p-6 text-center transition-all duration-300 min-h-[180px] flex flex-col items-center justify-center",
                    isDragging
                        ? 'border-white bg-white/10 ring-4 ring-white/5'
                        : 'border-white/10 hover:border-white/20 bg-white/[0.02]',
                    isLoading ? 'opacity-100 cursor-not-allowed border-none bg-transparent' : 'cursor-pointer',
                    selectedFile && !isLoading ? 'border-white/30 bg-white/5' : ''
                )}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                />

                {isLoading ? (
                    <div className="w-full space-y-4">
                        {/* Status Header */}
                        <div className="flex flex-col items-center mb-2">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 mb-3 relative">
                                <Loader2 className="w-6 h-6 text-white animate-spin absolute" />
                            </div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-widest leading-none">
                                {steps[loadingStep]}
                            </h3>
                            <p className="text-zinc-500 text-[9px] mt-2 uppercase tracking-[0.2em] font-bold opacity-60">System Synchronizing</p>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="relative pt-1">
                            {/* Track */}
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                {/* Progress Fill */}
                                <div
                                    className="h-full bg-white transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                                    style={{ width: `${((loadingStep + 1) / steps.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Steps Detailed Grid */}
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {steps.map((step, idx) => (
                                <div
                                    key={step}
                                    className={cn(
                                        "flex items-center gap-2.5 p-3 rounded-2xl border transition-all duration-500",
                                        idx <= loadingStep
                                            ? "bg-white/5 border-white/10"
                                            : "bg-transparent border-white/[0.03] opacity-20"
                                    )}
                                >
                                    <div className="shrink-0">
                                        {idx < loadingStep ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                        ) : idx === loadingStep ? (
                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,1)]" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-zinc-800" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest text-left",
                                        idx === loadingStep ? "text-white" : "text-zinc-600"
                                    )}>
                                        {step.replace('...', '')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : selectedFile ? (
                    <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mb-4">
                            <FileUp className="w-8 h-8 text-white opacity-40" />
                        </div>
                        <p className="text-white font-bold uppercase tracking-wider text-sm">{selectedFile.name}</p>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                            {(selectedFile.size / 1024).toFixed(1)} KB READY FOR UPLOAD
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFile();
                            }}
                            className="mt-6 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border border-white/5 rounded-xl hover:bg-white/5 cursor-pointer"
                        >
                            Remove and Change
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center group">
                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mb-5 group-hover:scale-110 group-hover:border-white/20 transition-all duration-500">
                            <FileText className="w-8 h-8 text-white opacity-20 group-hover:opacity-60 transition-opacity" />
                        </div>
                        <p className="text-white font-bold uppercase tracking-[0.2em] text-xs">{label}</p>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2">{description}</p>
                        <div className="mt-6 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                            Maximum size 10MB
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl animate-in slide-in-from-bottom-2 duration-300">
                    <p className="text-red-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </p>
                </div>
            )}
        </div>
    );
}
