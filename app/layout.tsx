import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';
import { OnboardingModal } from '../components/layout/OnboardingModal';
import { VoiceNavigator } from '../components/layout/VoiceNavigator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Abhay Parth | Retention-First Learning',
  description: 'AI-powered retention-first learning system for Indian competitive exams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex h-screen overflow-hidden bg-background text-text font-dmsans" suppressHydrationWarning>
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            {children}
          </main>
        </div>
        <VoiceNavigator />
        <OnboardingModal />
      </body>
    </html>
  );
}
