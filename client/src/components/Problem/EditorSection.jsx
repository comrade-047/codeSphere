import React from "react";
import { Play, UploadCloud } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Panel } from "react-resizable-panels";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";
import { useState } from "react";

const EditorSection = ({
  language,
  setLanguage,
  code,
  setCode,
  handleAction,
  showReviewButton,
  handleReviewRequest,
  aiReviewModal,
  setAiReviewModal,
  loading,
  user,
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
    <Panel
      defaultSize={65}
      minSize={60}
      maxSize={70}
      className="relative border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden flex flex-col"
    >
      <div className="flex justify-between items-center px-4 py-[11px] bg-gray-100 dark:bg-zinc-900 border-b dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <select
            id="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 text-sm bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-md focus:outline-none"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
        </div>
      </div>

      {/* Monaco Editor */}
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

      {/* Buttons: bottom-right corner, float inside panel */}
      <div className="absolute bottom-3 right-3 z-10 flex gap-2">
        {showReviewButton && (
          <button
          onClick={() => requireLogin() && handleReviewRequest()}
          disabled = {loading}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          Ai review
        </button>
        )}
        <button
          onClick={() => requireLogin() && handleAction("run")}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Play size={16} /> Run
        </button>
        <button
          onClick={() => requireLogin() && handleAction("submit")}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          <UploadCloud size={16} /> Submit
        </button>
      </div>
      {aiReviewModal?.open && <Modal setAiReviewModal={setAiReviewModal} aiReviewModal={aiReviewModal} loading={loading} />}
    </Panel>
  );
};

export default EditorSection;
