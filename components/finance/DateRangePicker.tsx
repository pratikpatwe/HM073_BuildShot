'use client';

import * as React from 'react';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface DateRangePickerProps {
    className?: string;
    onRangeChange: (range: { period: string; from?: Date; to?: Date }) => void;
}

const PRESETS = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 7 Days', value: 'week' },
    { label: 'Last 30 Days', value: 'month' },
    { label: 'Last Month', value: 'last_month' },
    { label: 'This Year', value: 'year' },
    { label: 'Custom Range', value: 'custom' },
];

export function DateRangePicker({
    className,
    onRangeChange,
}: DateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subMonths(new Date(), 1),
        to: new Date(),
    });
    const [period, setPeriod] = React.useState<string>('month');
    const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handlePresetSelect = (value: string) => {
        setPeriod(value);
        if (value === 'custom') return;

        let from: Date | undefined;
        let to: Date = new Date();

        switch (value) {
            case 'week':
                from = subDays(new Date(), 7);
                break;
            case 'month':
                from = subMonths(new Date(), 1);
                break;
            case 'last_month':
                from = startOfMonth(subMonths(new Date(), 1));
                to = endOfMonth(subMonths(new Date(), 1));
                break;
            case 'year':
                from = startOfYear(new Date());
                break;
            case 'all':
                from = undefined;
                to = new Date();
                break;
        }

        const newRange = { from, to };
        setDate(newRange);
        setTempDate(newRange);
        onRangeChange({ period: value, from, to });
        setIsPopoverOpen(false);
    };

    const handleApply = () => {
        if (tempDate?.from && tempDate?.to) {
            setDate(tempDate);
            setPeriod('custom');
            onRangeChange({ period: 'custom', from: tempDate.from, to: tempDate.to });
            setIsPopoverOpen(false);
        }
    };

    const getDisplayLabel = () => {
        if (period !== 'custom') {
            return PRESETS.find(p => p.value === period)?.label || 'Select Date';
        }
        if (date?.from && date?.to) {
            return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
        }
        return 'Select Date Range';
    };

    const selectionStep = !tempDate?.from ? 'start' : (!tempDate?.to ? 'end' : 'complete');

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover
                open={isPopoverOpen}
                onOpenChange={(open) => {
                    setIsPopoverOpen(open);
                    if (open) {
                        setTempDate(date);
                    }
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full sm:w-auto h-10 px-4 justify-start text-left font-medium bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800 rounded-xl transition-all hover:border-zinc-700 shadow-lg",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                        <span className="truncate">{getDisplayLabel()}</span>
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 bg-[#0B0B0B]/95 backdrop-blur-xl border-zinc-800 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row"
                    align="end"
                >
                    {/* Sidebar Presets */}
                    <div className="w-full md:w-48 p-2 border-b md:border-b-0 md:border-r border-zinc-800 bg-white/[0.02]">
                        <div className="flex flex-col gap-1">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.value}
                                    onClick={() => handlePresetSelect(p.value)}
                                    className={cn(
                                        "px-3 py-2 text-sm text-left rounded-lg transition-all",
                                        period === p.value && (period !== 'custom' || (date?.from && date?.to))
                                            ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                                            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                                    )}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calendar Area */}
                    <div className="flex flex-col">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={tempDate?.from}
                            selected={tempDate}
                            onSelect={(range) => {
                                setTempDate(range);
                                setPeriod('custom');
                            }}
                            numberOfMonths={2}
                            className="p-4"
                        />
                        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-white/[0.01]">
                            <div className="text-[12px] font-medium px-2">
                                {selectionStep === 'start' && (
                                    <span className="text-zinc-500 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Select Start Date
                                    </span>
                                )}
                                {selectionStep === 'end' && (
                                    <span className="text-emerald-400 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Select End Date
                                    </span>
                                )}
                                {selectionStep === 'complete' && tempDate?.from && tempDate?.to && (
                                    <span className="text-zinc-300 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                                        {format(tempDate.from, "MMM dd")} - {format(tempDate.to, "MMM dd, y")}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsPopoverOpen(false)}
                                    className="text-zinc-400 hover:text-white rounded-lg h-9 px-4 text-xs font-semibold"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-9 px-6 text-xs font-bold uppercase transition-all shadow-lg shadow-emerald-500/20"
                                    onClick={handleApply}
                                    disabled={selectionStep !== 'complete'}
                                >
                                    Apply Range
                                </Button>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

