import { ContextProvider } from '../context'; // Adjust import path accordingly
import NavBar from '../components/navbar'; // Adjust import path accordingly
import './globals.css'; // Uncomment this if you have global styles

export const metadata = {
  title: 'Guia',
  description: 'Guia is the smartest path to onboarding. Understand your codebase effortlessly, and onboard developers in record time.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ContextProvider>
          <div>
            <NavBar />
            {children} {/* Renders the specific page content */}
          </div>
        </ContextProvider>
      </body>
    </html>
  );
}
