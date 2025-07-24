import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Modal = ({ setAiReviewModal, aiReviewModal, loading }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-none shadow-xl w-full h-full overflow-y-auto">
        <h2 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
          AI Code Review
        </h2>

        <div className="prose dark:prose-invert text-sm max-w-none">
          <ReactMarkdown
            children={aiReviewModal.content}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-100 dark:bg-zinc-700 px-1 rounded">
                    {children}
                  </code>
                );
              },
            }}
          />
        </div>

        <div className="text-right mt-4">
          <button
            onClick={() => setAiReviewModal({ open: false, content: "" })}
            disabled={loading}
            className={`px-4 py-1.5 rounded-md transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export default Modal;
