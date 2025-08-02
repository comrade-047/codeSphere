import { Panel } from "react-resizable-panels";

const InputOutputSection = ({ rawInput, setRawInput, results, isProcessing, activeTab, setActiveTab }) => {
  
  const getOutputDisplay = () => {
    if (isProcessing) {
      if (results?.type === 'submit') return { value: "⏳ Submitting... Verdict: Pending", className: "text-yellow-400" };
      return { value: "⏳ Running...", className: "text-gray-400" };
    }
    if (!results) return { value: "Click 'Run' or 'Submit' to see the result.", className: "text-gray-500" };
    if (results.type === "run") {
      if (results.verdict && results.verdict !== 'Accepted') return { value: `Verdict: ${results.verdict}\n\n${results.error || ''}`, className: "text-red-400" };
      return { value: results.output, className: "text-gray-100" };
    }
    if (results.type === "submit" && results.submission) {
      const { verdict, output, error } = results.submission;
      switch (verdict) {
        case "Pending": return { value: "Submitting... Verdict: Pending", className: "text-yellow-400" };
        case "Accepted": return { value: "Verdict: Accepted ", className: "text-green-400" };
        case "Wrong Answer":
        case "Runtime Error":
        case "Time Limit Exceeded":
        case "Compilation Error":
          return { value: `Verdict: ${verdict}\n\n${output || error}`, className: "text-red-400" };
        default: return { value: `Status: ${verdict}`, className: "text-gray-400" };
      }
    }
    if (results.type === "error") return { value: results.error, className: "text-red-400" };
    return { value: "", className: "" };
  };

  const { value: displayValue, className: displayClassName } = getOutputDisplay();

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        activeTab === tabName
          ? 'text-gray-800 dark:text-white border-blue-500'
          : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Panel defaultSize={35} minSize={20} maxSize={80}>
      <div className="h-full bg-white dark:bg-zinc-900 border-t dark:border-zinc-700 flex flex-col">
        {/* Tab Headers */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-zinc-700">
          <TabButton tabName="testcase" label="Testcase" />
          <TabButton tabName="result" label="Result" />
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-4 overflow-auto">
          {activeTab === 'testcase' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Custom Input
              </label>
              <textarea
                rows={6}
                className="w-full h-full min-h-[100px] resize-none border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-md px-3 py-2 text-sm font-mono shadow-sm focus:outline-none "
                placeholder={`Enter input for the 'Run' button.`}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
              />
            </div>
          )}

          {activeTab === 'result' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Execution Result
              </label>
              <div
                className={`w-full h-full min-h-[100px] border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-800 rounded-md px-3 py-2 text-sm font-mono shadow-inner whitespace-pre-wrap ${displayClassName}`}
              >
                {displayValue}
              </div>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
};

export default InputOutputSection;
