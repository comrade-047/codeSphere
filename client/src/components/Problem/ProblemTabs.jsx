import { useState } from "react";
import ProblemDescription from "./ProblemDescription";
import MySubmissions from "../Submissions/MySubmissions";
import DiscussionSection from "../Discussions/DiscussionSection";
import { Brain, FileText, MessageSquare } from "lucide-react";

export default function ProblemTabs({ problem, submissions, isLoggedIn }) {
  const [activeTab, setActiveTab] = useState("problem");

  const tabs = [
    { key: "problem", label: "Problem", icon: <Brain className="w-4 h-4 mr-1.5" /> },
    { key: "submissions", label: "Submissions", icon: <FileText className="w-4 h-4 mr-1.5" /> },
    { key: "discussion", label: "Discussion", icon: <MessageSquare className="w-4 h-4 mr-1.5" /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden">
      {/* Tabs Header (Sticky) */}
      <div className="flex border-b dark:border-zinc-700 sticky top-0 z-10 bg-white dark:bg-zinc-900">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex items-center justify-center gap-1 px-4 py-2 text-sm sm:text-base font-medium w-full transition-all
              ${
                activeTab === tab.key
                  ? "text-blue-600  bg-blue-50 dark:bg-zinc-800"
                  : "text-gray-600 hover:text-blue-500 dark:text-gray-300"
              }
            `}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Scrollable Tab Content */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {activeTab === "problem" && <ProblemDescription problem={problem} />}
        {activeTab === "submissions" && (
          <MySubmissions submissions={submissions} isLoggedIn={isLoggedIn} />
        )}
        {activeTab === "discussion" && (
          <DiscussionSection isLoggedIn={isLoggedIn} />
        )}
      </div>
    </div>
  );
}
