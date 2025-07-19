import { Panel } from "react-resizable-panels";

const InputOutputSection = ({rawInput,setRawInput, outputResults}) => {
    return (
        <Panel defaultSize={40} minSize={20}>
            <div className="h-full bg-white border-t p-4 flex gap-4">
              <div className="w-1/2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Custom Input
                </label>
                <textarea
                  rows={6}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
                  placeholder="Enter raw input like:\n3\n1 2 3\n5"
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Output
                </label>
                <textarea
                  rows={6}
                  readOnly
                  className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 text-sm font-mono"
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
    )
}

export default InputOutputSection;