import React, { useState } from "react";
import { Question, Feedback } from "../types";
import { MessageSquare, Award, AlertTriangle, Lightbulb, PlayCircle, Eye, ChevronDown, ChevronUp, CheckCircle2, AlertCircle } from "lucide-react";

interface SimulatorProps {
  role: string;
  skillLevel: string;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswer: string;
  onUserAnswerChange: (answer: string) => void;
  onSubmitAnswer: (answer: string) => Promise<void>;
  isEvaluating: boolean;
  activeFeedback: Feedback | null;
  onNextQuestion: () => void;
  onQuitSession: () => void;
}

export default function Simulator({
  role,
  skillLevel,
  questions,
  currentQuestionIndex,
  userAnswer,
  onUserAnswerChange,
  onSubmitAnswer,
  isEvaluating,
  activeFeedback,
  onNextQuestion,
  onQuitSession,
}: SimulatorProps) {
  
  const currentQuestion: Question | undefined = questions[currentQuestionIndex];
  const [showTips, setShowTips] = useState<boolean>(false);
  const [characterCount, setCharacterCount] = useState<number>(userAnswer.length);

  // Character limit suggestion
  const minResponseCount = 40;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onUserAnswerChange(val);
    setCharacterCount(val.length);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim() || isEvaluating) return;
    onSubmitAnswer(userAnswer);
  };

  if (!currentQuestion) {
    return (
      <div className="border border-[#E5E1DA] bg-white p-12 text-center max-w-xl mx-auto space-y-4" id="sim-not-found">
        <p className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">Interview Session Stale or Ended</p>
        <button onClick={onQuitSession} className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-widest rounded-none">
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Question progress calculations
  const totalQuestions = questions.length;
  const progressPercent = ((currentQuestionIndex + (activeFeedback ? 1 : 0)) / totalQuestions) * 100;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in" id="simulator-root">
      
      {/* Session Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 border border-[#E5E1DA]">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#1A1A1A]/40 uppercase font-sans block">ACTIVE MOCK SIMULATION</span>
          <h2 className="text-2xl font-serif italic font-bold text-[#1A1A1A] truncate max-w-md mt-1">
            {role}
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/60 mt-0.5">Seniority Target: {skillLevel}</p>
        </div>
        <button
          onClick={onQuitSession}
          className="text-xs font-bold text-rose-700 hover:text-rose-900 px-3 py-1.5 border border-rose-200 bg-rose-50/50 uppercase tracking-wider self-start sm:self-center"
        >
          Quit & Discard
        </button>
      </div>

      {/* Progress bar tracker */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] text-[#1A1A1A]/70 font-bold uppercase tracking-wider font-sans">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Math.round(progressPercent)}% completed</span>
        </div>
        <div className="w-full bg-[#E5E1DA] h-[3px]">
          <div 
            className="h-full bg-[#1A1A1A] transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Main Stage (Question prompts, Answer drafts) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Question Display Card */}
          <div className="border border-[#E5E1DA] bg-white p-6 sm:p-8 relative overflow-hidden">
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                currentQuestion.type === "technical" ? "bg-blue-100 text-blue-900" :
                currentQuestion.type === "behavioral" ? "bg-violet-100 text-violet-900" :
                "bg-amber-100 text-amber-900"
              }`}>
                {currentQuestion.type} prompt
              </span>
            </div>

            <h3 className="text-3xl font-serif leading-tight text-[#1A1A1A] font-bold">
              {currentQuestion.question}
            </h3>

            {/* Recruiter's Tips collapsible cabinet */}
            <div className="mt-6 pt-4 border-t border-[#E5E1DA]">
              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]/50 hover:text-[#1A1A1A] focus:outline-none uppercase tracking-wider"
                id="btn-toggle-tips"
              >
                {showTips ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span>Recruiter's Tips & Rationale</span>
              </button>

              {showTips && (
                <div className="mt-3 text-xs bg-[#F2EFE9] border border-[#E5E1DA] p-4 space-y-3 font-sans animate-fade-in text-[#1A1A1A]">
                  <div className="space-y-1">
                    <p className="font-bold text-[#1A1A1A]/90">📌 Why recruiters ask this:</p>
                    <p className="leading-relaxed text-[#1A1A1A]/70">{currentQuestion.rationale}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-emerald-800">💡 Interview coaching suggestions:</p>
                    <p className="leading-relaxed text-[#1A1A1A]/70">{currentQuestion.tips}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Answer Entry stage (Hidden once evaluated) */}
          {!activeFeedback && (
            <form onSubmit={handleFormSubmit} className="border border-[#E5E1DA] bg-white p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest font-sans">
                  Draft Your Response
                </label>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${characterCount < minResponseCount ? "text-amber-700" : "text-[#1A1A1A]/50"}`}>
                  {characterCount} chars {characterCount < minResponseCount ? `(aim for ${minResponseCount}+)` : ""}
                </span>
              </div>

              <textarea
                required
                value={userAnswer}
                onChange={handleTextChange}
                disabled={isEvaluating}
                rows={10}
                placeholder="Formulate your professional answer response here... Use STAR methodology for behavioral questions (Situation, Task, Action, Result) to maximize score potential."
                className="w-full resize-none outline-none text-base font-serif border border-[#E5E1DA] p-6 rounded-none bg-white placeholder:text-[#1A1A1A]/30 text-[#1A1A1A]"
                id="simulator-answer-textarea"
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isEvaluating || !userAnswer.trim()}
                  className="flex-1 relative inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-5 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#2D2D2D] transition-colors disabled:opacity-40 disabled:pointer-events-none"
                  id="simulator-submit-ans-btn"
                >
                  {isEvaluating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Assessing terminology depth...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Submit Answer for AI Review</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onSubmitAnswer("")}
                  disabled={isEvaluating}
                  className="px-4 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] text-xs font-bold uppercase tracking-widest hover:bg-[#F2EFE9] transition-colors"
                  id="simulator-skip-btn"
                >
                  Skip
                </button>
              </div>
            </form>
          )}

          {/* Collapsible submitted copy for reference when feedback is ACTIVE */}
          {activeFeedback && (
            <div className="border border-[#E5E1DA] bg-white p-6 space-y-3">
              <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest border-b border-[#E5E1DA] pb-2">
                Your Submitted Answer
              </h4>
              <p className="text-base font-serif text-[#1A1A1A] leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
                {userAnswer || "[No answer provided]"}
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: AI Real-time Feedback & Dimension metrics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Coach Real-time panel (Visible once evaluated) */}
          {activeFeedback ? (
            <div className="space-y-6 animate-fade-in" id="live-evaluation-feedback">
              
              <div className="bg-[#F2EFE9] p-8 border border-[#E5E1DA] space-y-6">
                
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-[#1A1A1A]/10 pb-2 text-[#1A1A1A]">
                  AI Real-time Feedback
                </h3>
                
                {/* Score representation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                    <span>Analysis Rating</span>
                    <span className="font-serif italic text-lg">{activeFeedback.score}%</span>
                  </div>
                  <div className="w-full bg-[#D1CDC7] h-[2px]">
                    <div className="bg-[#1A1A1A] h-full transition-all duration-700" style={{ width: `${activeFeedback.score}%` }}></div>
                  </div>
                </div>

                {/* Narrative Paragraph */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#1A1A1A]/60">Summary Critique</p>
                  <p className="text-sm font-serif italic leading-relaxed text-[#1A1A1A] whitespace-pre-wrap">
                    "{activeFeedback.feedback}"
                  </p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">Strengths</p>
                    {activeFeedback.strengths.length === 0 ? (
                      <p className="text-xs text-[#1A1A1A]/70">No notable strengths identified. Keep practicing!</p>
                    ) : (
                      <ul className="text-xs space-y-1 text-[#1A1A1A]/85 pl-4 list-disc">
                        {activeFeedback.strengths.map((str, i) => <li key={i}>{str}</li>)}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-amber-900">Gaps Detected</p>
                    {activeFeedback.weaknesses.length === 0 ? (
                      <p className="text-xs text-[#1A1A1A]/70 font-serif italic">Perfect scope! No major gaps detected.</p>
                    ) : (
                      <ul className="text-xs space-y-1 text-[#1A1A1A]/85 pl-4 list-disc">
                        {activeFeedback.weaknesses.map((weak, i) => <li key={i}>{weak}</li>)}
                      </ul>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-900">Core Suggestion</p>
                    <ul className="text-xs space-y-1 text-[#1A1A1A]/85 pl-4 list-disc font-serif italic">
                      {activeFeedback.suggestions.map((sug, i) => <li key={i}>{sug}</li>)}
                    </ul>
                  </div>
                </div>

              </div>

              {/* Recommended Expert Response Block */}
              <div className="border border-[#E5E1DA] bg-white p-6 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] uppercase tracking-widest">
                  <Eye className="h-4 w-4" />
                  Model Answer Template
                </div>
                <p className="text-[10px] text-[#1A1A1A]/50 font-sans leading-relaxed">
                  Study this reference example to model correct terminology, robust sequencing, and ideal corporate formatting.
                </p>
                <div className="p-4 bg-[#F2EFE9] text-[#1A1A1A]/90 border border-[#E5E1DA] text-xs leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap font-mono">
                  {activeFeedback.modelAnswer}
                </div>
              </div>

            </div>
          ) : (
              /* Playbook checklist while answering */
              <div className="border border-[#E5E1DA] bg-white p-6 space-y-4 text-left">
                <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest border-b border-[#E5E1DA] pb-2">
                  Answering Playbooks
                </h4>
                
                <div className="space-y-4 text-xs text-[#1A1A1A]/80 font-sans">
                  <div className="space-y-1.5">
                    <p className="font-bold text-[#1A1A1A]">🕒 Mind Your Pace:</p>
                    <p className="leading-relaxed text-[#1A1A1A]/70">Answer thoroughly but avoid rambling. An ideal mock response consists of 100-300 words covering key bullet targets.</p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-bold text-[#1A1A1A]">🌟 The STAR Structure:</p>
                    <p className="leading-relaxed text-[#1A1A1A]/70">For behavioral topics, start with the **S**ituation (context), explain the **T**ask (objective), detail the **A**ction (specific skills), and quantify the **R**esult (outcomes).</p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-bold text-[#1A1A1A]">💻 Technical Clarity:</p>
                    <p className="leading-relaxed text-[#1A1A1A]/70">For technical topics, state the core mechanism first, explain why you selected that design, write structural specs, and analyze time/space bottlenecks.</p>
                  </div>
                </div>
              </div>
            )}

          {/* Primary Proceed Action Button */}
          {activeFeedback && (
            <button
              onClick={onNextQuestion}
              className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-5 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#2D2D2D] transition-colors"
              id="simulator-next-question-btn"
            >
              <span>{currentQuestionIndex + 1 < totalQuestions ? "Proceed to Next Question →" : "Finish & Analyze Session →"}</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
}
