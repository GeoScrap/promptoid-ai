import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { SessionProvider } from '@/components/providers/session-provider';
import { AuthDebugWrapper } from '@/components/providers/auth-debug-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Promptoid AI - Where Ideas Evolve Into Clarity',
  description: 'Promptoid AI helps you transform rough ideas into precise, detailed prompts that get better results from AI tools like ChatGPT.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <AuthDebugWrapper>
              {children}
              <Toaster />
            </AuthDebugWrapper>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}