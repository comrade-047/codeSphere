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
import InputOutputSection from "../../components/Problem/InputOutputSection";

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

  const { user, updateUser } = useContext(UserContext);

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
        const result = res.data.output;

        setOutputResults({
          type: "run",
          output: result.success ? result.output : "",
          error: result.success ? null : result.error?.message || "Unknown error",
        });
      } else {
        // type === "submit"
        const data = res.data;

        if (data.message === "Test case failed") {
          setOutputResults({
            type: "submit",
            output: null,
            error: `Test case ${data.testCase} failed\nInput: ${data.input}\nExpected: ${data.expectedOutput}\nActual: ${data.actualOutput}\nError: ${data.error || "N/A"}`,
            verdict: data.verdict,
          });
        } else {
          if (data.verdict === "Accepted") {
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
            output: `Submission verdict: ${data.verdict}`,
            error: null,
            verdict: data.verdict,
          });
        }
      }
    } catch (err) {
      setOutputResults({
        type: "error",
        output: null,
        error:
          err?.response?.data?.message || "Something went wrong. Please try again.",
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
          <EditorSection language={language} setLanguage={setLanguage} code={code} setCode={setCode} handleAction={handleAction} user={user}/>

          <PanelResizeHandle className="h-1 bg-gray-300 cursor-row-resize" />

          {/* Input / Output Section */}
          <InputOutputSection setRawInput={setRawInput} rawInput={rawInput} outputResults={outputResults} />
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default ProblemPage;
