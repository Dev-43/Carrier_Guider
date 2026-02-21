import { Link } from 'react-router-dom';

export default function MainMenu() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-8 max-w-3xl">
        <h1 className="text-4xl tracking-tight font-extrabold text-[var(--color-dark)] sm:text-5xl md:text-6xl">
          Welcome to <span className="text-[var(--color-royal)]">Career Guider</span>
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl mx-auto">
          Take our comprehensive assessment to discover your ideal career path based on your academic strengths, personality traits, and personal interests.
        </p>
        
        <div className="mt-8 flex justify-center space-x-6">
          <Link
            to="/assessment"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[var(--color-royal)] hover:bg-[var(--color-royal-dark)] md:py-4 md:text-lg md:px-10 shadow-lg transform transition hover:-translate-y-1"
          >
            Start Assessment
          </Link>
          <Link
            to="/career_roadmap"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 shadow-sm"
          >
            View Results Overview
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full max-w-5xl">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-[var(--color-royal)] mb-4 text-xl font-bold">1</div>
          <h3 className="text-lg font-medium text-[var(--color-dark)]">Academic Setup</h3>
          <p className="mt-2 text-sm text-gray-500">Provide your marks or grades to assess your foundational strengths.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-[var(--color-royal)] mb-4 text-xl font-bold">2</div>
          <h3 className="text-lg font-medium text-[var(--color-dark)]">RIASEC Test</h3>
          <p className="mt-2 text-sm text-gray-500">Take the personality test to see domains that suit your character.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="w-12 h-12 inline-flex items-center justify-center rounded-full bg-blue-100 text-[var(--color-royal)] mb-4 text-xl font-bold">3</div>
          <h3 className="text-lg font-medium text-[var(--color-dark)]">Interest Check</h3>
          <p className="mt-2 text-sm text-gray-500">Select what interests you most to finalize your career profile.</p>
        </div>
      </div>
    </div>
  );
}
