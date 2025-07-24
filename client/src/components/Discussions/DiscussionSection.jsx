import React from 'react';
import { MessageCircle } from 'lucide-react';

const DiscussionSection = ({ isLoggedIn }) => {
  return (
    <div className="h-full overflow-y-auto px-4 py-6 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageCircle size={20} /> Discussion
      </h2>

      {!isLoggedIn ? (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic">
          You need to{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            log in
          </a>{' '}
          to view and post in the discussion section.
        </p>
      ) : (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>💬 Discussion functionality coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default DiscussionSection;
