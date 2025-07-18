import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { UserContext } from "../../context/userContext";
import ProblemDescription from "../../components/Problem/ProblemDescription";
import EditorSection from "../../components/Problem/EditorSection";

const templateObj = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}`,
  python: `def main():\n    # your code here\n    pass\n\nmain()`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}`,
  javascript: `function main() {\n    // your code here\n}\n\nmain();`,
};

const ProblemPage = () => {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [outputResults, setOutputResults] = useState(null);

  const {user, updateUser} = useContext(UserContext);

  useEffect(() => {
    axiosInstance
      .get(API_PATHS.PROBLEM.PROBLEMBYSLUG(slug))
      .then((res) => {
        const prob = res.data.problem;
        setProblem(prob);

        const example = prob.examples?.[0];
        if (example?.input) {
          setRawInput(example.input);
        }

        if (templateObj?.[language]) {
          setCode(templateObj[language]);
        }
      })
      .catch((err) => console.error("Problem fetch error:", err))
      .finally(() => setLoading(false));
  }, [slug, language]);

  const handleAction = async (type) => {
    setOutputResults({ loading: true });

    try {
      const payload =
        type === "run"
          ? { slug, language, code, input: rawInput }
          : { slug, language, code };

      const res = await axiosInstance.post(API_PATHS.JUDGE(type), payload);

      if (type === "run") {
        setOutputResults({
          type: "run",
          output: res.data.output,
        });
      } else {
        // Check if the response is indicating a failed test case
        if (res.data.message === "Test case failed") {
          setOutputResults({
            type: "error",
            message: `Test case failed on ${res.data.testCase}.\nInput: ${res.data.input}\nExpected:${res.data.expectedOutput}\nActual:${res.data.actualOutput}`,
          });
        } else {
          // Accepted or partial success path
          const verdict = res.data.verdict;
          if (verdict === "Accepted") {
            const newProblemId = problem._id;
            if (!user.problemsSolved.includes(newProblemId)) {
              updateUser({
                ...user,
                problemsSolved: [...user.problemsSolved, newProblemId],
              });
            }
          }

          setOutputResults({
            type: "submit",
            verdict: res.data.verdict,
            results: res.data.results || [],
          });
        }
      }
    } catch (err) {
      // This is for true HTTP/network/backend errors (status >= 400)
      setOutputResults({
        type: "error",
        message:
          err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };


  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(templateObj[lang] || "");
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!problem) return <div className="p-8 text-center text-red-500">Problem not found</div>;

  return (
    <PanelGroup direction="horizontal" className="min-h-screen w-screen text-sm bg-gray-100">
      {/* Sidebar */}
      <Panel defaultSize={40} minSize={25} maxSize={60}>
        <ProblemDescription problem={problem} />
      </Panel>

      <PanelResizeHandle className="w-1 bg-gray-300 cursor-col-resize" />

      {/* Editor Panel */}
      <Panel>
        <PanelGroup direction="vertical">
          {/* Code Editor */}
          <EditorSection language={language} setLanguage={setLanguage} code={code} setCode={setCode} handleAction={handleAction} />

          <PanelResizeHandle className="h-1 bg-gray-300 cursor-row-resize" />

          {/* Input / Output Section */}
          <Panel defaultSize={40} minSize={20}>
            <div className="h-full bg-white border-t p-4 flex gap-4">
              <div className="w-1/2">
                <label className="block font-semibold text-gray-700 mb-1">Custom Input</label>
                <textarea
                  rows={6}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
                  placeholder="Enter raw input like:\n3\n1 2 3\n5"
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block font-semibold text-gray-700 mb-1">Output</label>
                <textarea
                  rows={6}
                  readOnly
                  className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 text-sm font-mono"
                  value={
                    outputResults?.type === "run"
                      ? outputResults.output
                      : outputResults?.type === "error"
                      ? outputResults.message
                      : ""
                  }
                />
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default ProblemPage;
