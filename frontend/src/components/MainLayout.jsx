import { Outlet, Link } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-pearl)] flex flex-col">
      <header className="bg-[var(--color-royal)] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/main" className="text-2xl font-bold tracking-tight">
                Career Guider
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link to="/assessment" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Assessment</Link>
              <Link to="/career_roadmap" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Roadmap</Link>
              <button className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Logout</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Career Guider. All rights reserved.
      </footer>
    </div>
  );
}
