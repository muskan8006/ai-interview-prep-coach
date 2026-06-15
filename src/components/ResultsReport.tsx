import React, { useState } from "react";
import { InterviewSession } from "../types";
import { Award, CheckCircle2, AlertCircle, Bookmark, Clipboard, ArrowRight, CornerDownRight, ChevronRight, ChevronDown, CheckCircle } from "lucide-react";

interface ResultsReportProps {
  session: InterviewSession;
  onFinish: () => void;
  isEvaluatingSession: boolean;
}

export default function ResultsReport({ session, onFinish, isEvaluatingSession }: ResultsReportProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Computations
  const resultsList = Object.values(session.results);
  const totalQuestions = resultsList.length;
  
  // Local average score computation if backend didn't supply overallScore
  let calculatedScore = session.overallScore;
  if (calculatedScore === undefined && totalQuestions > 0) {
    const sum = resultsList.reduce((acc, curr) => acc + (curr.feedback?.score || 0), 0);
    calculatedScore = Math.round(sum / totalQuestions);
  }
  const score = calculatedScore || 0;

  const toggleDetail = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Reassuring Corporate Assessment Loader in Editorial Style
  if (isEvaluatingSession) {
    return (
      <div className="max-w-xl mx-auto border border-[#E5E1DA] bg-[#F2EFE9] p-12 text-center space-y-6" id="results-loader">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-none border border-[#1A1A1A] bg-white text-[#1A1A1A]">
          <Clipboard className="h-8 w-8 text-[#1A1A1A]" />
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-serif italic font-bold text-[#1A1A1A]">Compiling Master Evaluation...</h3>
          <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans max-w-sm mx-auto uppercase tracking-wider">
            Our Assessor engine is analyzing your 5 response benchmarks, reviewing specialized vocabulary, and compiling your roadmap...
          </p>
        </div>
        <div className="w-full bg-[#E5E1DA] h-[3px]">
          <div className="h-full bg-[#1A1A1A] animate-[pulse_1.5s_infinite]" style={{ width: "75%" }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in" id="results-report-root">
      
      {/* Prime Scorecard Card */}
      <div className="border border-[#E5E1DA] bg-[#1A1A1A] p-6 sm:p-8 text-white relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          
          {/* Circular Score Circle */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.08)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="64" 
                cy="64" 
                r="54" 
                stroke={score >= 80 ? "#10b981" : score >= 65 ? "#3b82f6" : "#f59e0b"} 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 54}
                strokeDashoffset={2 * Math.PI * 54 * (1 - score / 100)}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-serif italic font-bold tracking-tight text-white">
                {score}%
              </span>
              <span className="text-[9px] uppercase tracking-widest font-sans text-slate-400 font-bold">
                SCORE
              </span>
            </div>
          </div>

          {/* Assessment Narrative text */}
          <div className="space-y-3 text-center md:text-left flex-1">
            <span className="inline-block border border-emerald-500 bg-emerald-950 text-emerald-300 px-3 py-1 text-[9px] font-bold uppercase tracking-widest">
              Simulation Completed
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif italic font-bold text-white leading-tight">
              {session.role} Interview Critique
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-medium whitespace-pre-wrap">
              {session.overallSummary || `Excellent effort practicing! You completed ${totalQuestions} evaluation rounds. Review the targeted feedback recommendations below to study appropriate domain terminologies and logical structures.`}
            </p>
          </div>

        </div>
      </div>

      {/* Aggregate Strengths, Weaknesses and Action Roadmaps */}
      {(session.strengthsSummary || session.weaknessesSummary || session.suggestionsSummary) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Macro Strengths */}
          {session.strengthsSummary && session.strengthsSummary.length > 0 && (
            <div className="border border-[#E5E1DA] bg-white p-5 space-y-4">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-widest font-sans flex items-center gap-1.5 border-b border-emerald-100 pb-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 animate-pulse" />
                Aggregated Strengths
              </h4>
              <ul className="text-xs space-y-2 text-[#1A1A1A] font-sans pl-1 list-disc list-inside">
                {session.strengthsSummary.map((str, idx) => (
                  <li key={idx} className="leading-relaxed"><span className="text-[#1A1A1A]/85 font-medium">{str}</span></li>
                ))}
              </ul>
            </div>
          )}

          {/* Macro Gaps */}
          {session.weaknessesSummary && session.weaknessesSummary.length > 0 && (
            <div className="border border-[#E5E1DA] bg-white p-5 space-y-4">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest font-sans flex items-center gap-1.5 border-b border-amber-100 pb-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Key Omissions
              </h4>
              <ul className="text-xs space-y-2 text-[#1A1A1A] font-sans pl-1 list-disc list-inside">
                {session.weaknessesSummary.map((weak, idx) => (
                  <li key={idx} className="leading-relaxed"><span className="text-[#1A1A1A]/85 font-medium">{weak}</span></li>
                ))}
              </ul>
            </div>
          )}

          {/* Detailed coaching actions guidance */}
          {session.suggestionsSummary && session.suggestionsSummary.length > 0 && (
            <div className="border border-[#E5E1DA] bg-white p-5 space-y-4 md:col-span-2 lg:col-span-1">
              <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest font-sans flex items-center gap-1.5 border-b border-[#E5E1DA] pb-2">
                <Bookmark className="h-4 w-4 text-[#1A1A1A]" />
                Target Preparation Plan
              </h4>
              <ul className="text-xs space-y-2 text-[#1A1A1A] font-sans pl-1 list-disc list-inside">
                {session.suggestionsSummary.map((sug, idx) => (
                  <li key={idx} className="leading-relaxed"><span className="text-[#1A1A1A]/85 font-medium">{sug}</span></li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* Accordion Questions details list */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif italic text-[#1A1A1A] font-bold tracking-tight border-b border-[#E5E1DA] pb-2">
          Detailed Question-By-Question Backlog
        </h3>

        <div className="space-y-3">
          {resultsList.map((res, index) => {
            const qId = res.question.id;
            const isExpanded = expandedId === qId;
            const singleScore = res.feedback?.score || 0;

            return (
              <div 
                key={qId} 
                className={`border bg-white transition-all rounded-none ${
                  isExpanded ? "border-[#1A1A1A]" : "border-[#E5E1DA] hover:border-[#1A1A1A]/50"
                }`}
                id={`results-q-card-${qId}`}
              >
                {/* Header Row */}
                <button
                  onClick={() => toggleDetail(qId)}
                  className="w-full flex items-center justify-between p-5 focus:outline-none text-left"
                >
                  <div className="flex items-center gap-4 pr-4 truncate">
                    <span className="flex h-8 w-8 items-center justify-center border border-[#E5E1DA] bg-[#F2EFE9] text-xs font-bold text-[#1A1A1A] shrink-0 font-display">
                      Q{index + 1}
                    </span>
                    <div className="truncate space-y-1">
                      <p className="text-sm font-serif italic font-semibold text-[#1A1A1A] truncate leading-tight">
                        {res.question.question}
                      </p>
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-[#F2EFE9] text-[#1A1A1A]/70 px-2 py-0.5 border border-[#E1DDD5]">
                        {res.question.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 uppercase font-sans">
                    <span className={`inline-flex items-center justify-center border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      singleScore >= 80 ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                      singleScore >= 65 ? "bg-blue-50 text-blue-800 border-blue-200" :
                      singleScore > 0 ? "bg-amber-50 text-amber-800 border-amber-200" :
                      "bg-rose-50 text-rose-800 border-rose-200"
                    }`}>
                      {singleScore > 0 ? `${singleScore}%` : "SKIPPED"}
                    </span>
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-[#1A1A1A]/50" /> : <ChevronRight className="h-4 w-4 text-[#1A1A1A]/50" />}
                  </div>
                </button>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-6 border-t border-[#E5E1DA] bg-[#F2EFE9]/40 space-y-6 text-xs leading-relaxed font-sans text-[#1A1A1A]">
                    
                    {/* User's response text */}
                    <div className="space-y-2">
                      <p className="font-bold text-[#1A1A1A] uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <CornerDownRight className="h-4 w-4" />
                        Your Submitted Response:
                      </p>
                      <p className="p-4 bg-white border border-[#E5E1DA] leading-relaxed text-[#1A1A1A]/90 font-serif italic whitespace-pre-wrap text-sm">
                        {res.userAnswer || "[Answer skipped by candidate; evaluated as incomplete.]"}
                      </p>
                    </div>

                    {/* Feedback report */}
                    {res.feedback ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Summary Narrative */}
                        <div className="bg-white border border-[#E5E1DA] p-5 space-y-2 md:col-span-2">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1A1A1A]/60">Coach Critique Assessment:</p>
                          <p className="text-[#1A1A1A] font-serif italic text-sm">"{res.feedback.feedback}"</p>
                        </div>

                        {/* Pros */}
                        <div className="bg-white border border-emerald-200 p-4 space-y-2">
                          <p className="font-bold text-emerald-950 uppercase tracking-widest text-[9px] flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Pros Identified:
                          </p>
                          <ul className="space-y-1 text-[#1A1A1A] pl-3 list-disc">
                            {res.feedback.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                          </ul>
                        </div>

                        {/* Cons */}
                        <div className="bg-white border border-amber-200 p-4 space-y-2">
                          <p className="font-bold text-amber-950 uppercase tracking-widest text-[9px] flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Missing Items / Areas for Growth:
                          </p>
                          <ul className="space-y-1 text-[#1A1A1A] pl-3 list-disc font-serif italic">
                            {res.feedback.weaknesses.map((weak, idx) => <li key={idx}>{weak}</li>)}
                          </ul>
                        </div>

                        {/* Suggestions */}
                        <div className="bg-white border border-[#E5E1DA] p-5 space-y-2 md:col-span-2">
                          <p className="font-bold text-[#1A1A1A] uppercase tracking-widest text-[9px]">Suggestions for Upgrading Response:</p>
                          <ul className="space-y-1 text-[#1A1A1A]/90 pl-3 list-disc">
                            {res.feedback.suggestions.map((sug, idx) => <li key={idx}>{sug}</li>)}
                          </ul>
                        </div>

                        {/* Expert reference copy template */}
                        <div className="space-y-2 md:col-span-2">
                          <p className="font-bold text-[#1A1A1A] uppercase tracking-widest text-[9px] bg-white border border-[#E5E1DA] px-3 py-1.5 inline-block">
                            Model Answer Template
                          </p>
                          <div className="p-5 bg-white border border-[#E5E1DA] text-[#1A1A1A]/90 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all max-h-60 overflow-y-auto">
                            {res.feedback.modelAnswer}
                          </div>
                        </div>

                      </div>
                    ) : (
                      <p className="text-slate-400 italic font-serif">No feedback requested or resolved for this question.</p>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions bottom banner */}
      <div className="border-t border-[#E5E1DA] pt-6 flex">
        <button
          onClick={onFinish}
          className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-6 py-4.5 text-xs font-bold uppercase tracking-widest hover:bg-[#2D2D2D] transition-colors"
          id="results-back-dashboard-btn"
        >
          <span>Return & Save to Portfolio</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
