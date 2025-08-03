import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { UserContext } from "../../context/userContext";
import EditorSection from "../../components/Problem/EditorSection";
import InputOutputSection from "../../components/Problem/InputOutputSection";
import ProblemTabs from "../../components/Problem/ProblemTabs";
import { fetchProblem, fetchUserSubmissions } from "../../utils/helper";

const templateObj = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    return 0;\n}`,
  python: `def main():\n    # your code here\n    pass\n\nmain()`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // your code here\n    }\n}`,
  javascript: `function main() {\n    // your code here\n}\n\nmain();`,
};

const ProblemPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const contestSlug = location.state?.contestSlug;

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [rawInput, setRawInput] = useState("");
  const [loadingAiReview ,setLoadingAiReview] = useState(false);
  const [showReviewButton, setShowReviewButton] = useState(false);
  const [aiReviewModal, setAiReviewModal] = useState({open : false, content : ""});
  const [submissions, setSubmissions] = useState([]);
  const [readOnlySubmission, setReadOnlySubmission] = useState(null);

  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeIoTab, setActiveIoTab] = useState("testcase");
  const [pollingRunId, setPollingRunId] = useState(null);
  const [pollingSubmissionId, setPollingSubmissionId] = useState(null);
  const runPollTimeoutRef = useRef(null);
  const submitPollTimeoutRef = useRef(null);

  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    if (!pollingRunId) {
      clearTimeout(runPollTimeoutRef.current);
      return;
    }
    const poll = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.JUDGE.RUN_STATUS(pollingRunId));
        if (res.data.status === "completed") {
          setResults({ type: "run", ...res.data });
          setIsProcessing(false);
          setPollingRunId(null);
        } else {
          runPollTimeoutRef.current = setTimeout(poll, 3500);
        }
      } catch (error) {
        console.error("Run polling error:", error);
        setResults({ type: "error", error: "Could not fetch run status." });
        setIsProcessing(false);
        setPollingRunId(null);
      }
    };
    runPollTimeoutRef.current = setTimeout(poll, 3500);
    return () => clearTimeout(runPollTimeoutRef.current);
  }, [pollingRunId]);

  useEffect(() => {
    if (!pollingSubmissionId) {
      clearTimeout(submitPollTimeoutRef.current);
      return;
    }
    const poll = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.JUDGE.SUBMIT_STATUS(pollingSubmissionId));
        const submissionData = res.data;
        setResults({ type: "submit", submission: submissionData });
        if (submissionData.verdict !== "Pending") {
          setIsProcessing(false);
          setPollingSubmissionId(null);
          if (submissionData.verdict === "Accepted") {
            if(!contestSlug){
              setShowReviewButton(true);
              const newProblemId = problem._id;
              if (user && !user.problemsSolved.includes(newProblemId)) {
                updateUser({
                  ...user,
                  problemsSolved: [...user.problemsSolved, newProblemId],
                });
              }
            }
          }
          const subs = await fetchUserSubmissions(problem._id);
          setSubmissions(subs);
        } else {
          submitPollTimeoutRef.current = setTimeout(poll, 4500);
        }
      } catch (error) {
        console.error("Submission polling error:", error);
        setResults({
          type: "error",
          error: "Could not fetch submission status.",
        });
        setIsProcessing(false);
        setPollingSubmissionId(null);
      }
    };
    submitPollTimeoutRef.current = setTimeout(poll, 4500);
    return () => clearTimeout(submitPollTimeoutRef.current);
  }, [pollingSubmissionId]);

  useEffect(() => {
    const loadProblem = async () => {
      setLoading(true);
      try {
        const { problem: prob } = await fetchProblem(slug);
        setProblem(prob);

        const example = prob.examples?.[0];
        if (example?.input) setRawInput(example.input);
        const subs = await fetchUserSubmissions(prob._id);
        setSubmissions(subs);
      } catch (err) {
        console.error("Problem fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [slug]);

  useEffect(() => {
    if (!readOnlySubmission) {
      setCode(templateObj[language] || "");
    }
  }, [language, readOnlySubmission]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleAction = async (type) => {
    setIsProcessing(true);
    setShowReviewButton(false);
    setResults(null);
    setActiveIoTab("result");

    clearTimeout(runPollTimeoutRef.current);
    clearTimeout(submitPollTimeoutRef.current);
    setPollingRunId(null);
    setPollingSubmissionId(null);

    try {
      if (type === "run") {
        const payload = { slug, language, code, input: rawInput };
        const res = await axiosInstance.post(API_PATHS.JUDGE.JUDGE("run"), payload);
        setResults({ type: "run", loading: true });
        setPollingRunId(res.data.runId);
      } else {
        let res;
        if(contestSlug){
          const payload = {problemId : problem._id, language, code};
          res = await axiosInstance.post(API_PATHS.CONTESTS.SUBMIT(contestSlug),payload);
        }
        else {
          const payload = { slug, language, code };
          res = await axiosInstance.post(
            API_PATHS.JUDGE.JUDGE("submit"),
            payload
          );
        }

        setResults({ type: "submit", submission: { verdict: "Pending" } });
        setPollingSubmissionId(res.data.submissionId);
      }
    } catch (err) {
      setResults({
        type: "error",
        error: err?.response?.data?.message || "Something went wrong.",
      });
      setIsProcessing(false);
    }
  };

  const handleAiReviewRequest = async () => {
    setLoadingAiReview(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AI_REVIEW, {
        code,
        language,
      });
      setAiReviewModal({ open: true, content: res.data.review });
    } catch (err) {
      console.log("Failed to fetch AI review", err);
    }
    setLoadingAiReview(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!problem)
    return (
      <div className="p-8 text-center text-red-500">Problem not found</div>
    );

  return (
    <PanelGroup
      direction="horizontal"
      className="h-screen-[4px] w-screen text-sm bg-gray-100 dark:bg-zinc-900 text-gray-800 dark:text-gray-100 transition-colors p-2 "
    >
      <Panel
        defaultSize={45}
        minSize={35}
        maxSize={60}
        className="flex flex-col"
      >
        <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-800 rounded-lg">
          <ProblemTabs
            problem={problem}
            isLoggedIn={user}
            submissions={submissions}
            setSelectedSubmission={(sub) => setReadOnlySubmission(sub)}
          />
        </div>
      </Panel>

      <PanelResizeHandle className="resize-handle" />

      <Panel className="rounded-lg ">
        <PanelGroup direction="vertical">
          <EditorSection
            language={language}
            setLanguage={handleLanguageChange}
            code={code}
            setCode={setCode}
            handleAction={handleAction}
            user={user}
            showReviewButton={showReviewButton}
            handleReviewRequest={handleAiReviewRequest}
            aiReviewModal={aiReviewModal}
            setAiReviewModal={setAiReviewModal}
            loadingAiReview={loadingAiReview}
            readOnlysubmission={readOnlySubmission}
            setReadOnlySubmission={setReadOnlySubmission}
            isProcessing={isProcessing}
          />

          <PanelResizeHandle className="horizontal-resize-handle" />

          <InputOutputSection
            setRawInput={setRawInput}
            rawInput={rawInput}
            results={results}
            isProcessing={isProcessing}
            activeTab={activeIoTab}
            setActiveTab={setActiveIoTab}
          />
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
};

export default ProblemPage;
