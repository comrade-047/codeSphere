import { Panel } from "react-resizable-panels";

const InputOutputSection = ({ rawInput, setRawInput, outputResults }) => {
  return (
    <Panel defaultSize={40} minSize={20}>
      <div className="h-full bg-white dark:bg-zinc-900 border-t dark:border-zinc-700 p-4 flex flex-col md:flex-row gap-6 overflow-auto">
        {/* Input Area */}
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Custom Input
          </label>
          <textarea
            rows={6}
            className="w-full resize-none border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-md px-3 py-2 text-sm font-mono shadow-sm focus:outline-none "
            placeholder={`Enter raw input like:\n3\n1 2 3\n5`}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
          />
        </div>

        {/* Output Area */}
        <div className="w-full md:w-1/2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Output
          </label>
          <textarea
            rows={6}
            readOnly
            className="w-full resize-none border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 rounded-md px-3 py-2 text-sm font-mono shadow-inner focus:outline-none"
            value={
              outputResults?.loading
                ? "⏳ Running..."
                : outputResults?.error
                ? outputResults.error
                : outputResults?.output || ""
            }
          />
        </div>
      </div>
    </Panel>
  );
};

export default InputOutputSection;
