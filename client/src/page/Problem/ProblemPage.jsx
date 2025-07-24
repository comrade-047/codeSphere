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
import EditorSection from "../../components/Problem/EditorSection";
import InputOutputSection from "../../components/Problem/InputOutputSection";
import ProblemTabs from "../../components/Problem/ProblemTabs";

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
  const [loadingAiReview ,setLoadingAiReview] = useState(false);
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [aiReviewModal, setAiReviewModal] = useState({open : false, content : ""});

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
          setShowReviewButton(true);
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

  const handleAiReviewRequest = async() => {
    setLoadingAiReview(true);
    try{
      const res = await axiosInstance.post(API_PATHS.AI_REVIEW,{
        code,
        language
      });

      setAiReviewModal({open : true, content : res.data.review});
    }
    catch(err){
      console.log("Failed to fetch AI review",err);
    }
    setLoadingAiReview(false);
  }

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(templateObj[lang] || "");
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!problem) return <div className="p-8 text-center text-red-500">Problem not found</div>;

  return (
    <PanelGroup
      direction="horizontal"
      className="h-screen w-screen text-sm bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-100 transition-colors p-2 "
    >
      {/* Sidebar */}
      <Panel
        defaultSize={45}
        minSize={35}
        maxSize={60}
        className="flex flex-col  border-gray-200 dark:border-zinc-700"
      >
        <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-800 rounded-lg scroll-smooth">
          {/* <ProblemDescription problem={problem} /> */}
          <ProblemTabs problem={problem} isLoggedIn={user} submissions={[]} />
        </div>
      </Panel>

      <PanelResizeHandle className="resize-handle" />

      {/* Editor Panel */}
      <Panel className="rounded-lg ">
        <PanelGroup direction="vertical">
          <EditorSection
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            handleAction={handleAction}
            user={user}
            showReviewButton={showReviewButton}
            handleReviewRequest={handleAiReviewRequest}
            aiReviewModal={aiReviewModal}
            setAiReviewModal={setAiReviewModal}
            loading = {loadingAiReview}
          />

          <PanelResizeHandle className="horizontal-resize-handle" />

          <InputOutputSection
            setRawInput={setRawInput}
            rawInput={rawInput}
            outputResults={outputResults}
          />
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default ProblemPage;
