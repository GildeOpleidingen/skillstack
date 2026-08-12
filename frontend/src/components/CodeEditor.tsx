'use client';

import { fetchNextExercise } from '@/lib/api';
import Editor from '@monaco-editor/react';
import { ArrowRight, CheckCircle, Clock, Loader2, Play, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TestCaseResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

interface SubmissionResult {
  id: string;
  status: 'PENDING' | 'PASSED' | 'FAILED' | 'PARTIAL';
  score: number;
  feedback: string;
  executionTime: number;
  testCaseResults: TestCaseResult[];
  compilationError?: string;
  consoleOutput?: string;
  createdAt?: string;
}

interface CodeEditorProps {
  exerciseId: string;
  userId: string;
  starterCode: string;
  language: string;
  currentLanguageKey: string; // Add this to get the frontend language key
}

export default function CodeEditor({ exerciseId, userId, starterCode, language, currentLanguageKey }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<SubmissionResult[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [nextExercise, setNextExercise] = useState<any>(null);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const router = useRouter();

  // Map language to Monaco Editor language ID
  const getMonacoLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      CPP: 'cpp',
      JAVASCRIPT: 'javascript',
      TYPESCRIPT: 'typescript',
      PYTHON: 'python',
      JAVA: 'java',
      GO: 'go',
      RUST: 'rust',
      CSHARP: 'csharp',
      PHP: 'php',
      C: 'c',
      SQL: 'sql',
      HTML: 'html',
      CSS: 'css',
    };
    return languageMap[lang] || 'plaintext';
  };

  // Fetch previous submissions on mount
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/submissions/user/${userId}?exerciseId=${exerciseId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data);
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [userId, exerciseId]);

  // Check for next exercise when a 100% submission is found
  useEffect(() => {
    const hasPassedSubmission = submissions.some(submission => submission.status === 'PASSED');
    if (hasPassedSubmission && !nextExercise && !isLoadingNext) {
      checkForNextExercise();
    }
  }, [submissions]);

  const checkForNextExercise = async () => {
    setIsLoadingNext(true);
    try {
      const next = await fetchNextExercise(currentLanguageKey, exerciseId);
      setNextExercise(next);
    } catch (error) {
      console.error('Failed to fetch next exercise:', error);
    } finally {
      setIsLoadingNext(false);
    }
  };

  const handleNextExercise = () => {
    if (nextExercise) {
      router.push(`/exercises/${currentLanguageKey}/${nextExercise.id}`);
    } else {
      // No more exercises, go back to exercises page
      router.push(`/exercises/${currentLanguageKey}`);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/submissions/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          exerciseId,
          code,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const data = await response.json();

      // Add new submission to the beginning of the list
      setSubmissions([data, ...submissions]);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Code Editor */}
      <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] overflow-hidden">
        <div className="bg-black/[.03] dark:bg-white/[.03] px-4 py-2 border-b border-black/[.08] dark:border-white/[.145] flex items-center justify-between">
          <h3 className="font-semibold">Code Editor</h3>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-lg transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Code
              </>
            )}
          </button>
        </div>
        <Editor
          height="400px"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* Submission History */}
      <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
        <h3 className="font-semibold text-lg mb-4">Submission History</h3>

        {isLoadingSubmissions ? (
          <div className="text-center py-8 text-black/70 dark:text-white/70">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            Loading submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8 text-black/70 dark:text-white/70">
            No submissions yet. Run your code to see results here!
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10 dark:scrollbar-thumb-white/15 hover:scrollbar-thumb-black/20 dark:hover:scrollbar-thumb-white/25">
            {submissions.map((submission, idx) => (
              <div
                key={submission.id}
                className={`border rounded-xl p-4 ${
                  idx === 0 ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10' : 'border-black/[.08] dark:border-white/[.145]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {idx === 0 && <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">LATEST</span>}
                    {submission.createdAt && (
                      <span className="flex items-center gap-1 text-xs text-black/50 dark:text-white/50">
                        <Clock className="h-3 w-3" />
                        {new Date(submission.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {submission.status === 'PASSED' && (
                      <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Passed
                      </span>
                    )}
                    {submission.status === 'PARTIAL' && (
                      <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-medium text-sm">
                        <CheckCircle className="h-4 w-4" />
                        Partial
                      </span>
                    )}
                    {submission.status === 'FAILED' && (
                      <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-medium text-sm">
                        <XCircle className="h-4 w-4" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                {submission.compilationError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 text-sm mb-1">Compilation Error</h4>
                    <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono">
                      {submission.compilationError}
                    </pre>
                  </div>
                )}

                {submission.consoleOutput && submission.consoleOutput !== 'No console output generated' && (
                  <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-3 mb-3">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-1 flex items-center gap-2">
                      <span>🖥️</span>
                      Console Output
                    </h4>
                    <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono max-h-32 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10 dark:scrollbar-thumb-white/15 hover:scrollbar-thumb-black/20 dark:hover:scrollbar-thumb-white/25">
                      {submission.consoleOutput}
                    </pre>
                  </div>
                )}

                {submission.consoleOutput === 'No console output generated' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-1 flex items-center gap-2">
                      <span>ℹ️</span>
                      Console Output
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      No console output was generated by your program. Add print statements or debug output to see results here.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm mb-2">
                  <div>
                    <span className="text-black/70 dark:text-white/70">Score: </span>
                    <span className="font-semibold">{submission.score.toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="text-black/70 dark:text-white/70">Time: </span>
                    <span className="font-semibold">{submission.executionTime}ms</span>
                  </div>
                </div>

                <p className="text-sm text-black/70 dark:text-white/70 mb-3">{submission.feedback}</p>

                {submission.testCaseResults && submission.testCaseResults.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Test Cases</h4>
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5">
                      {submission.testCaseResults.map((testCase, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-center h-8 rounded-lg text-sm ${
                            testCase.passed
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                              : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                          } border-2`}
                          title={testCase.passed ? 'Passed' : testCase.error || 'Failed'}
                        >
                          {testCase.passed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Exercise Button */}
      {submissions.some(s => s.status === 'PASSED') && (
        <div className="rounded-2xl border border-solid border-black/[.08] dark:border-white/[.145] p-6">
          <h3 className="font-semibold text-lg mb-4 text-green-700 dark:text-green-300">🎉 Exercise Completed!</h3>
          {isLoadingNext ? (
            <div className="flex items-center gap-2 text-black/70 dark:text-white/70">
              <Loader2 className="h-4 w-4 animate-spin" />
              Looking for next exercise...
            </div>
          ) : nextExercise ? (
            <div className="space-y-3">
              <p className="text-sm text-black/70 dark:text-white/70">
                Great job! Ready for the next challenge?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleNextExercise}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                  Next Exercise: {nextExercise.title}
                </button>
                <button
                  onClick={() => router.push(`/exercises/${currentLanguageKey}`)}
                  className="flex items-center gap-2 px-4 py-2 border border-black/[.08] dark:border-white/[.145] rounded-lg hover:bg-black/[.03] dark:hover:bg-white/[.03] transition-colors"
                >
                  Back to Exercises
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-black/70 dark:text-white/70">
                Congratulations! You've completed all exercises for this language.
              </p>
              <button
                onClick={() => router.push(`/exercises/${currentLanguageKey}`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
                Back to Exercises
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}