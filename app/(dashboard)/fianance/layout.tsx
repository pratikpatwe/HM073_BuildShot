import Chatbot from '@/components/fianance/Chatbot';

export default function FiananceLayout({
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
