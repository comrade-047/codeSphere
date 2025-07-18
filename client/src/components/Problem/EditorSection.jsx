import React from "react";
import { Play, UploadCloud } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Panel } from "react-resizable-panels";

const EditorSection = ({
  language,
  setLanguage,
  code,
  setCode,
  handleAction,
}) => (
  <Panel defaultSize={60}>
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div className="ml-auto flex gap-3">
          <button
            className="flex items-center gap-1 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => handleAction("run")}
          >
            <Play size={16} />
            Run
          </button>

          <button
            className="flex items-center gap-1 px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => handleAction("submit")}
          >
            <UploadCloud size={16} />
            Submit
          </button>
        </div>
      </div>

      <Editor
        language={language}
        value={code}
        onChange={(val) => setCode(val || "")}
        theme="vs-dark"
        height="100%"
        options={{ fontSize: 14 }}
      />
    </div>
  </Panel>
);

export default EditorSection;
