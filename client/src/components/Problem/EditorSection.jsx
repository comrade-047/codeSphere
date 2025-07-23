import React from "react";
import { Play, UploadCloud } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Panel } from "react-resizable-panels";
import { useNavigate } from "react-router-dom";

const EditorSection = ({
  language,
  setLanguage,
  code,
  setCode,
  handleAction,
  user
}) => {
  const navigate = useNavigate();

  const requireLogin = () => {
    if (!user) {
      alert("Please log in to run or submit your code.");
      navigate("/login");
      return false;
    }
    return true;
  };

  return (
    <Panel defaultSize={60}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded outline-none"
            >
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="ml-auto flex gap-3">
            <button
              className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => {
                if (requireLogin()) handleAction("run");
              }}
            >
              <Play size={16} />
              Run
            </button>

            <button
              className="flex items-center gap-1 px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition"
              onClick={() => {
                if (requireLogin()) handleAction("submit");
              }}
            >
              <UploadCloud size={16} />
              Submit
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <Editor
          language={language}
          value={code}
          onChange={(val) => setCode(val || "")}
          theme="vs-dark"
          height="100%"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </Panel>
  );
};

export default EditorSection;
