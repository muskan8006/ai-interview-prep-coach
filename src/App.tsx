import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import SetupForm from "./components/SetupForm";
import Simulator from "./components/Simulator";
import ResultsReport from "./components/ResultsReport";
import { InterviewSession, Question, Feedback, QuestionResult } from "./types";
import { FALLBACK_QUESTIONS } from "./data";
import { AlertCircle, RefreshCw, Star, X } from "lucide-react";

const STORAGE_KEY = "prepcoach_interview_history_v1";

export default function App() {
  const [currentTab, setCurrentTab] = useState<"dashboard" | "setup" | "simulating" | "results">("dashboard");
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);
  
  // Running simulation details
  const [userAnswerDraft, setUserAnswerDraft] = useState<string>("");
  const [activeFeedback, setActiveFeedback] = useState<Feedback | null>(null);
  
  // Loading indicators
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState<boolean>(false);
  const [isEvaluatingSession, setIsEvaluatingSession] = useState<boolean>(false);

  // Error notifications
  const [errorToast, setErrorToast] = useState<{ message: string; subText?: string } | null>(null);
  const [demoBannerActive, setDemoBannerActive] = useState<boolean>(false);

  // Load from local storage history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      } else {
        // Seed first complete history record to look nice
        const seedSession: InterviewSession = {
          id: "seed-session-pm",
          role: "Product Manager",
          skillLevel: "Mid-Level Professional",
          date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          questions: [
            {
              id: "q1",
              question: "How do you prioritize a product roadmap when you have competing inputs from sales, engineering, and support?",
              type: "scenario",
              rationale: "Tests strategic prioritization models (RICE, Kano) and negotiating abilities.",
              tips: "Describe standard frameworks, customer metrics, and data alignments."
            }
          ],
          currentQuestionIndex: 1,
          isCompleted: true,
          results: {
            "q1": {
              question: {
                id: "q1",
                question: "How do you prioritize a product roadmap when you have competing inputs?",
                type: "scenario",
                rationale: "Tests strategic prioritization structures.",
                tips: "Describe standard frameworks."
              },
              userAnswer: "I use the RICE framework. Reach, Impact, Confidence, and Effort. I align sales requests by business ARR impact, support inputs by user churn risk, and work with engineering to reserve 20% headcount for technical debt of codebase.",
              feedback: {
                score: 88,
                strengths: ["Utilized structured RICE prioritization model", "Reserved dedicated capacity for architectural technical debt", "Directly linked requests to critical commercial KPIs."],
                weaknesses: ["Could have spoken more on how customer validation research plays into roadmap refinement."],
                suggestions: ["Outline customer interviews or quantitative usability metrics before estimating Confidence score."],
                feedback: "A highly clear, structural response mapping technical and commercial priorities nicely. Showing exact ARR mapping establishes competitive senior ownership.",
                modelAnswer: "Typically, prioritization hinges on structural alignment with strategic goals. I implement the RICE scoring model (Reach x Impact x Confidence / Effort) to maintain mathematical objectivity..."
              }
            }
          },
          overallScore: 88,
          overallSummary: "Excellent grasp of strategic execution frameworks. Demonstrated advanced competency balancing engineering maintenance budgets with user experience metrics.",
          strengthsSummary: ["Direct applicability of structured prioritization (RICE)", "Reserved code quality investments"],
          weaknessesSummary: ["User research loop validation details"],
          suggestionsSummary: ["Incorporate customer-centric rapid prototyping feedback loops."]
        };
        
        setHistory([seedSession]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify([seedSession]));
      }
    } catch (e) {
      console.error("Local storage lookup failed:", e);
    }
  }, []);

  // Save to history helper
  const saveHistory = (newHistory: InterviewSession[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error("Local storage save failed:", e);
    }
  };

  // Launch fresh simulation
  const handleLaunchSession = async (role: string, skillLevel: string) => {
    setIsGeneratingQuestions(true);
    setErrorToast(null);
    setDemoBannerActive(false);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, skillLevel })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Server responded with an error generating questions");
      }

      const data = await response.json();
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No specific questions returned from the server.");
      }

      const newSession: InterviewSession = {
        id: "session_" + Date.now(),
        role,
        skillLevel,
        date: new Date().toISOString(),
        questions: data.questions,
        currentQuestionIndex: 0,
        results: {},
        isCompleted: false
      };

      setCurrentSession(newSession);
      setUserAnswerDraft("");
      setActiveFeedback(null);
      setCurrentTab("simulating");
    } catch (err: any) {
      console.warn("Failed live question generation, launching fallback offline mode:", err);
      
      // Fallback: Locate fallback questions for matching keywords in lowercase
      let fallbackRoleKey = "default";
      const cleanedRole = role.toLowerCase();
      if (cleanedRole.includes("engineer") || cleanedRole.includes("developer") || cleanedRole.includes("software")) {
        fallbackRoleKey = "software-engineer";
      } else if (cleanedRole.includes("product") || cleanedRole.includes("pm")) {
        fallbackRoleKey = "product-manager";
      } else if (cleanedRole.includes("analyst") || cleanedRole.includes("data")) {
        fallbackRoleKey = "data-analyst";
      }

      const qList = FALLBACK_QUESTIONS[fallbackRoleKey] || FALLBACK_QUESTIONS["default"];
      
      const offlineSession: InterviewSession = {
        id: "session_" + Date.now() + "_fallback",
        role,
        skillLevel,
        date: new Date().toISOString(),
        questions: qList.map((q, idx) => ({
          ...q,
          id: `q_fallback_${idx}`
        })),
        currentQuestionIndex: 0,
        results: {},
        isCompleted: false
      };

      setCurrentSession(offlineSession);
      setUserAnswerDraft("");
      setActiveFeedback(null);
      setDemoBannerActive(true);
      setErrorToast({
        message: "Offline Preparation Mode Enabled",
        subText: "We activated our curated offline question set for your role because the backend Gemini API key is not configured. Go live anytime under Settings > Secrets."
      });
      setCurrentTab("simulating");
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Submit Answer & Evaluate live
  const handleSubmitAnswer = async (answerText: string) => {
    if (!currentSession) return;
    setIsEvaluatingAnswer(true);
    setErrorToast(null);

    const questionsList = currentSession.questions;
    const currIdx = currentSession.currentQuestionIndex;
    const currentQuestion = questionsList[currIdx];

    try {
      const response = await fetch("/api/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: currentSession.role,
          skillLevel: currentSession.skillLevel,
          questionText: currentQuestion.question,
          userAnswer: answerText
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed answer evaluation request.");
      }

      const data = await response.json();
      const feedback: Feedback = data.evaluation;

      setActiveFeedback(feedback);

      // Save to temporary session state results
      const updatedResults: Record<string, QuestionResult> = {
        ...currentSession.results,
        [currentQuestion.id]: {
          question: currentQuestion,
          userAnswer: answerText,
          feedback
        }
      };

      setCurrentSession({
        ...currentSession,
        results: updatedResults
      });
    } catch (err: any) {
      console.warn("Failed server evaluations, implementing structural fallback model assessment:", err);
      
      // Dynamic offline mock critique computation so it's playable
      const wordCount = answerText.split(/\s+/).filter(Boolean).length;
      let mockScore = 50;
      let feedbackNote = "Your response is noted. Unfortunately, are running offline and cannot analyze with GPT-levels.";
      
      if (wordCount === 0) {
        mockScore = 20;
        feedbackNote = "No solution contents were supplied. A strong review requires clearly explaining the scenario parameters.";
      } else if (wordCount < 15) {
        mockScore = 45;
        feedbackNote = "The answer text seems too concise. Recruiters seek structured metrics. Try to utilize STAR frameworks.";
      } else {
        mockScore = Math.min(85, 60 + Math.floor(Math.random() * 20));
        feedbackNote = `A reliable, structured response draft emphasizing key deliverables. (Offline Fallback critique - configured successfully with ${wordCount} words provided).`;
      }

      const mockFeedback: Feedback = {
        score: mockScore,
        strengths: ["Supplied written response content", "Provided outline details of the situation"],
        weaknesses: ["Unable to verify deeper domain-specific terminologies offline", "Missing advanced metrics analysis"],
        suggestions: ["Introduce specific metrics, e.g. latency metrics, users count, or percentage sales conversions", "Adopt the STAR pattern explicitly."],
        feedback: feedbackNote,
        modelAnswer: "Typically, an ideal template starts with clear strategic contexts. E.g.: 'In my previous deployment, I took charge of the roadmap alignment. I standardly launched RICE scoring to build structural benchmarks, achieving 18% improvement...'"
      };

      setActiveFeedback(mockFeedback);

      const updatedResults: Record<string, QuestionResult> = {
        ...currentSession.results,
        [currentQuestion.id]: {
          question: currentQuestion,
          userAnswer: answerText,
          feedback: mockFeedback
        }
      };

      setCurrentSession({
        ...currentSession,
        results: updatedResults
      });

      setErrorToast({
        message: "Offline Evaluation Complete",
        subText: "We generated structural feedback offline because the Gemini API key was not retrieved from Secrets. Verify your configuration anytime!"
      });
    } finally {
      setIsEvaluatingAnswer(false);
    }
  };

  // Skip step or next question index change
  const handleNextQuestion = async () => {
    if (!currentSession) return;

    const questionsList = currentSession.questions;
    const currIdx = currentSession.currentQuestionIndex;
    const nextIdx = currIdx + 1;

    // Check if we have more questions
    if (nextIdx < questionsList.length) {
      setCurrentSession({
        ...currentSession,
        currentQuestionIndex: nextIdx
      });
      setUserAnswerDraft("");
      setActiveFeedback(null);
    } else {
      // Completed last question! Perform session-wide aggregate analysis!
      setIsEvaluatingSession(true);
      setCurrentTab("results");
      setErrorToast(null);

      const resultsList = Object.values(currentSession.results).map((r: QuestionResult) => ({
        question: r.question.question,
        type: r.question.type,
        userAnswer: r.userAnswer,
        score: r.feedback?.score || 0,
        strengths: r.feedback?.strengths || [],
        weaknesses: r.feedback?.weaknesses || []
      }));

      try {
        const response = await fetch("/api/evaluate-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: currentSession.role,
            skillLevel: currentSession.skillLevel,
            results: resultsList
          })
        });

        if (!response.ok) {
          throw new Error("Failed to compile session-level aggregates.");
        }

        const data = await response.json();
        const agg = data.aggregateEvaluation;

        setCurrentSession({
          ...currentSession,
          isCompleted: true,
          overallScore: agg.overallScore,
          overallSummary: agg.overallSummary,
          strengthsSummary: agg.strengthsSummary,
          weaknessesSummary: agg.weaknessesSummary,
          suggestionsSummary: agg.suggestionsSummary
        });
      } catch (err: any) {
        console.warn("Offline aggregating fallback calculations:", err);
        
        // Simple client calculation of average score
        const total = resultsList.reduce((acc, curr) => acc + curr.score, 0);
        const avg = Math.round(total / (resultsList.length || 1));

        setCurrentSession({
          ...currentSession,
          isCompleted: true,
          overallScore: avg,
          overallSummary: "You successfully completed the simulation mock. Outstanding job practicing active recall! Below are detailed performance matrices generated across individual query outcomes.",
          strengthsSummary: ["Showed disciplined consistency finishing the sequence", "Communicated outline context solutions under timer standard"],
          weaknessesSummary: ["A aggregate evaluation requires a connected and verified Gemini API Key to run. Explore setup choices to configure."],
          suggestionsSummary: ["Complete another targeted session as soon as you have added your API Key!"]
        });

        setErrorToast({
          message: "Mock Session Aggregated Offline",
          subText: "We calculated your score arithmetic offline. Standard evaluation requires active Google AI Studio Secrets."
        });
      } finally {
        setIsEvaluatingSession(false);
      }
    }
  };

  // Complete and save to portfoliio
  const handleFinishSession = () => {
    if (!currentSession) return;
    
    // Save to historical portfolio list
    const updatedHistory = [
      {
        ...currentSession,
        isCompleted: true
      },
      ...history
    ];
    
    saveHistory(updatedHistory);
    setCurrentSession(null);
    setUserAnswerDraft("");
    setActiveFeedback(null);
    setCurrentTab("dashboard");
    setErrorToast(null);
    setDemoBannerActive(false);
  };

  // Review historic portfolio items
  const handleReviewHistoricSession = (session: InterviewSession) => {
    setCurrentSession(session);
    setCurrentTab("results");
    setErrorToast(null);
    setDemoBannerActive(false);
  };

  // Sidebar selectors directly launching configuration screen
  const handleSelectPredefinedRole = (presetId: string) => {
    setCurrentSession(null);
    setCurrentTab("setup");
    setErrorToast(null);
    setDemoBannerActive(false);
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] flex flex-col">
      
      {/* Top navbar */}
      <Navigation 
        currentTab={currentTab} 
        activeSessionId={currentSession && !currentSession.isCompleted ? currentSession.id : null}
        onTabChange={(tab) => {
          if (tab === "setup") {
            setCurrentSession(null);
            setUserAnswerDraft("");
            setActiveFeedback(null);
          }
          setCurrentTab(tab);
          setErrorToast(null);
        }}
      />

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Dynamic Alerts Toasts */}
        {errorToast && (
          <div className="border border-[#E5E1DA] bg-[#F2EFE9] p-5 text-left animate-fade-in relative rounded-none">
            <button 
              onClick={() => setErrorToast(null)}
              className="absolute top-4 right-4 text-[#1A1A1A]/60 hover:text-[#1A1A1A] focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[#1A1A1A] mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">{errorToast.message}</h4>
                {errorToast.subText && (
                  <p className="text-xs text-[#1A1A1A]/70 mt-1 font-sans leading-relaxed">
                    {errorToast.subText}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Demo banner active */}
        {demoBannerActive && (
          <div className="bg-[#1A1A1A] p-3.5 text-white flex items-center justify-between text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-none animate-pulse">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-current text-amber-300 shrink-0" />
              <span>Offline Preparation Mode (Resilient Falling Back Set) is active!</span>
            </div>
            <button 
              onClick={() => setDemoBannerActive(false)} 
              className="text-white/80 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Dynamic Routing views */}
        {currentTab === "dashboard" && (
          <Dashboard 
            history={history}
            onStartNew={() => {
              setCurrentSession(null);
              setCurrentTab("setup");
            }}
            onReviewSession={handleReviewHistoricSession}
            onSelectPredefinedRole={handleSelectPredefinedRole}
          />
        )}

        {currentTab === "setup" && (
          <SetupForm 
            onLaunch={handleLaunchSession}
            isGenerating={isGeneratingQuestions}
          />
        )}

        {currentTab === "simulating" && currentSession && (
          <Simulator 
            role={currentSession.role}
            skillLevel={currentSession.skillLevel}
            questions={currentSession.questions}
            currentQuestionIndex={currentSession.currentQuestionIndex}
            userAnswer={userAnswerDraft}
            onUserAnswerChange={setUserAnswerDraft}
            onSubmitAnswer={handleSubmitAnswer}
            isEvaluating={isEvaluatingAnswer}
            activeFeedback={activeFeedback}
            onNextQuestion={handleNextQuestion}
            onQuitSession={() => {
              if (window.confirm("Are you sure you want to quit this interview preparation session? Your parameters and response drafts will be lost.")) {
                setCurrentSession(null);
                setUserAnswerDraft("");
                setActiveFeedback(null);
                setCurrentTab("dashboard");
                setErrorToast(null);
                setDemoBannerActive(false);
              }
            }}
          />
        )}

        {currentTab === "results" && currentSession && (
          <ResultsReport 
            session={currentSession}
            onFinish={handleFinishSession}
            isEvaluatingSession={isEvaluatingSession}
          />
        )}

      </main>

      {/* Modern bottom footer */}
      <footer className="border-t border-[#E5E1DA] bg-[#FCFAF7] py-8 mt-12 text-[#1A1A1A]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between space-y-3 sm:space-y-0 text-[10px] font-bold uppercase tracking-wider font-sans">
          <div>
            &copy; {new Date().getFullYear()} Vantage Interview prep system. Powered securely server-side.
          </div>
          <div className="flex justify-center gap-6">
            <span className="hover:text-[#1A1A1A] cursor-help transition-colors">STAR Framework</span>
            <span className="hover:text-[#1A1A1A] cursor-help transition-colors">Diagnostic Metrics</span>
            <span className="hover:text-[#1A1A1A] cursor-help transition-colors">Gemini-Powered Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
