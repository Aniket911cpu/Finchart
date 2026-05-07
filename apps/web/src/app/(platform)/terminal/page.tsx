'use client';
import { TerminalLayout } from '../../../components/terminal/TerminalLayout';
import ChartEngine from '../../../components/chart/ChartEngine';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export default function TerminalPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <TerminalLayout>
        {/* Dynamic importing of ChartEngine is usually better to avoid SSR issues,
            but since ChartEngine uses light-weight charts, we make sure it checks for window inside */}
        <ChartEngine />
      </TerminalLayout>
    </QueryClientProvider>
  );
}
