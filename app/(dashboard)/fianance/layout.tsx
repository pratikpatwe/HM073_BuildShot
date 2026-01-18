import Chatbot from '@/components/fianance/Chatbot';
import Navbar from '@/components/fianance/Navbar';

export default function FiananceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-black">
            <Navbar />
            {children}
            <Chatbot />
        </div>
    );
}
