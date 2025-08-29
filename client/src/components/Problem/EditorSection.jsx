import React, { useEffect, useState } from "react";
import {
  Play,
  UploadCloud,
  X,
  Code2,
  History,
  LoaderCircle,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Panel } from "react-resizable-panels";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal";

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
  loadingAiReview,
  user,
  readOnlysubmission,
  setReadOnlySubmission,
  isProcessing,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("solution");

  const [editorTheme, setEditorTheme] = useState("vs-light");

  useEffect(() => {
    if (readOnlysubmission) {
      setActiveTab("readonly");
    }
  }, [readOnlysubmission]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setEditorTheme(savedTheme === "dark" ? "vs-dark" : "vs-light");

    const observer = new MutationObserver(() => {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setEditorTheme(currentTheme === "dark" ? "vs-dark" : "vs-light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

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
      minSize={0}
      maxSize={100}
      className="relative border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden flex flex-col"
    >
      {/* Top Tabs */}
      <div className="flex border-b border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-900">
        <button
          onClick={() => setActiveTab("solution")}
          className={`px-4 py-[10px] text-sm font-medium flex items-center gap-1 ${
            activeTab === "solution"
              ? "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-zinc-800"
              : "text-gray-600 hover:text-blue-500 dark:text-gray-300"
          }`}
        >
          <Code2 size={16} />
          Code
        </button>

        {readOnlysubmission && (
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab("readonly")}
              className={`relative px-4 py-[10px] text-sm font-medium flex items-center gap-1 ${
                activeTab === "readonly"
                  ? "text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-zinc-800"
                  : "text-gray-600 hover:text-blue-500 dark:text-gray-300"
              }`}
            >
              <History size={16} />
              {readOnlysubmission.verdict}
            </button>
            <button
              onClick={() => {
                setReadOnlySubmission(null);
                setActiveTab("solution");
              }}
              className="text-gray-400 px-1"
              title="Close submission"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Language selector */}
      {activeTab === "solution" && (
        <div className="flex justify-between items-center px-4 py-1 bg-gray-100 dark:bg-zinc-900 border-b dark:border-zinc-700">
          <select
            value={language}
            onChange={setLanguage}
            className="px-3 py-1 text-sm bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-md focus:outline-none"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
        </div>
      )}

      {/* Editor view */}
      <div className="flex-1">
        {activeTab === "solution" && (
          <Editor
            language={language}
            value={code}
            onChange={(val) => setCode(val || "")}
            theme={editorTheme} 
            height="100%"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        )}

        {activeTab === "readonly" && readOnlysubmission && (
          <Editor
            language={readOnlysubmission.languages}
            value={readOnlysubmission.code}
            theme={editorTheme} 
            height="100%"
            options={{
              fontSize: 14,
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        )}
      </div>

      {/* Bottom buttons */}
      <div className="absolute bottom-3 right-3 z-10 flex gap-2">
        {showReviewButton && (
          <button
            onClick={() => requireLogin() && handleReviewRequest()}
            disabled={loadingAiReview}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition disabled:bg-purple-400"
          >
            {loadingAiReview ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : (
              "AI Review"
            )}
          </button>
        )}
        {isProcessing ? (
          <button
            disabled
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-gray-500 text-white rounded-md cursor-not-allowed"
          >
            <LoaderCircle size={16} className="animate-spin" />
            Processing...
          </button>
        ) : (
          <>
            <button
              onClick={() => requireLogin() && handleAction("run")}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <Play size={16} />
              Run
            </button>
            <button
              onClick={() => requireLogin() && handleAction("submit")}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <UploadCloud size={16} />
              Submit
            </button>
          </>
        )}
      </div>

      {aiReviewModal?.open && (
        <Modal
          setAiReviewModal={setAiReviewModal}
          aiReviewModal={aiReviewModal}
          loading={loadingAiReview}
        />
      )}
    </Panel>
  );
};

export default EditorSection;
