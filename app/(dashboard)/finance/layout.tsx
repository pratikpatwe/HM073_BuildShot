import Chatbot from '@/components/finance/Chatbot';

export default function FinanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-[#0b0b0b]">
            {children}
            <Chatbot />
        </div>
    );
}
