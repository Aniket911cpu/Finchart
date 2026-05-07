import './globals.css';
import { AuthProvider } from '../components/auth/AuthProvider';
import { Toaster } from 'react-hot-toast';
export const metadata = {
    title: 'FinChart Pro — Professional Trading Analysis',
    description: 'AI-powered financial charting platform for stocks, crypto, forex and more.',
};
export default function RootLayout({ children, }) {
    return (<html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" toastOptions={{
            style: {
                background: '#111827',
                color: '#E8E9EC',
                border: '1px solid rgba(255,255,255,0.07)',
            },
        }}/>
        </AuthProvider>
      </body>
    </html>);
}
//# sourceMappingURL=layout.js.map