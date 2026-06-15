import React from "react";
import { InterviewSession } from "../types";
import { PRESET_ROLES } from "../data";
import { BarChart, Clock, Award, Star, ArrowRight, Play, CheckCircle, Search, HelpCircle, Eye } from "lucide-react";

interface DashboardProps {
  history: InterviewSession[];
  onStartNew: () => void;
  onReviewSession: (session: InterviewSession) => void;
  onSelectPredefinedRole: (roleId: string) => void;
}

export default function Dashboard({ history, onStartNew, onReviewSession, onSelectPredefinedRole }: DashboardProps) {
  
  // Computations
  const completedSessions = history.filter(s => s.isCompleted);
  const totalCompleted = completedSessions.length;
  
  const averageScore = totalCompleted > 0
    ? Math.round(completedSessions.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / totalCompleted)
    : null;

  const totalQuestionsPracticed = completedSessions.reduce((acc, curr) => {
    return acc + Object.values(curr.results).length;
  }, 0);

  // Group by role to find the candidate's favorite role
  const rolesTally: Record<string, number> = {};
  completedSessions.forEach(s => {
    rolesTally[s.role] = (rolesTally[s.role] || 0) + 1;
  });
  let topRole = "None yet";
  let maxCount = 0;
  Object.entries(rolesTally).forEach(([r, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topRole = r;
    }
  });

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-root">
      
      {/* Prime Editorial Banner greeting */}
      <div className="border border-[#E5E1DA] bg-[#F2EFE9] p-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#E5E1DA] bg-white text-[#1A1A1A] text-[10px] font-bold uppercase tracking-widest">
            <Star className="h-3 w-3 fill-current text-amber-500" />
            AI Interview Evaluation Panel Live
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif italic text-[#1A1A1A] leading-tight font-bold">
            Evaluate your interview skills with real-time AI feedback.
          </h2>
          <p className="text-[#1A1A1A]/80 text-xs sm:text-sm leading-relaxed max-w-2xl font-sans">
            Select your desired job target, receive custom technical & behavioral questions, draft your answers, and receive corporate assessments instantly.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <button
              onClick={onStartNew}
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#2D2D2D] transition-colors"
              id="dashboard-launch-session-btn"
            >
              <Play className="h-3 w-3 fill-current" />
              Configure Custom Session
            </button>
            <a
              href="#prepreset-roles"
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] hover:underline underline-offset-4"
            >
              Learn about Preset Roles <ArrowRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Numerical Coaching Stats Banner in clean flat column cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* STAT 1: Avg Score Gauge */}
        <div className="border border-[#E5E1DA] bg-white p-5 flex items-center gap-4 hover:border-[#1A1A1A]/40 transition-colors">
          <div className="bg-[#F2EFE9] p-3 text-[#1A1A1A] border border-[#E5E1DA]">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-[#1A1A1A]/50 uppercase font-sans">
              Average Score
            </p>
            <p className="text-3xl font-serif italic text-[#1A1A1A] font-bold mt-1">
              {averageScore !== null ? `${averageScore}%` : "—"}
            </p>
            <p className="text-[10px] text-[#1A1A1A]/60 mt-0.5">
              {averageScore !== null
                ? averageScore >= 80 ? "🎯 Elite Performance" : averageScore >= 60 ? "📈 Competitive readiness" : "✏️ Review feedback to grow"
                : "Complete a mock session"}
            </p>
          </div>
        </div>

        {/* STAT 2: Practiced Count */}
        <div className="border border-[#E5E1DA] bg-white p-5 flex items-center gap-4 hover:border-[#1A1A1A]/40 transition-colors">
          <div className="bg-emerald-50 p-3 text-emerald-800 border border-emerald-100">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-[#1A1A1A]/50 uppercase font-sans">
              Completed Rounds
            </p>
            <p className="text-3xl font-serif italic text-[#1A1A1A] font-bold mt-1">
              {totalCompleted}
            </p>
            <p className="text-[10px] text-[#1A1A1A]/60 mt-0.5">
              Prep sessions logged
            </p>
          </div>
        </div>

        {/* STAT 3: Practiced Questions */}
        <div className="border border-[#E5E1DA] bg-white p-5 flex items-center gap-4 hover:border-[#1A1A1A]/40 transition-colors">
          <div className="bg-indigo-50 p-3 text-indigo-800 border border-indigo-100">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-[#1A1A1A]/50 uppercase font-sans">
              Practiced Questions
            </p>
            <p className="text-3xl font-serif italic text-[#1A1A1A] font-bold mt-1">
              {totalQuestionsPracticed}
            </p>
            <p className="text-[10px] text-[#1A1A1A]/60 mt-0.5">
              Assessed dimensions
            </p>
          </div>
        </div>

        {/* STAT 4: Favorite preparation career */}
        <div className="border border-[#E5E1DA] bg-white p-5 flex items-center gap-4 hover:border-[#1A1A1A]/40 transition-colors">
          <div className="bg-amber-50 p-3 text-amber-800 border border-amber-100">
            <BarChart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-[#1A1A1A]/50 uppercase font-sans">
              Top Prep Focus
            </p>
            <div className="text-sm font-sans font-bold text-[#1A1A1A] truncate max-w-[150px] mt-1.5">
              {topRole}
            </div>
            <p className="text-[10px] text-[#1A1A1A]/60 mt-1">
              {completedSessions.length > 0 ? `Targeted most frequently` : "No sessions logged"}
            </p>
          </div>
        </div>
      </div>

      {/* Target presets selector */}
      <section id="prepreset-roles" className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between border-b border-[#E5E1DA] pb-2">
          <h3 className="text-xl font-serif italic text-[#1A1A1A] font-bold tracking-tight">
            Targeted Job Scenarios & Roles
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A]/50">Or create your custom title in simulation launcher</span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRESET_ROLES.map((role) => {
            const roleCount = completedSessions.filter(s => s.role.toLowerCase() === role.name.toLowerCase()).length;
            
            return (
              <button
                key={role.id}
                onClick={() => onSelectPredefinedRole(role.id)}
                className="group text-left border border-[#E5E1DA] bg-white p-6 hover:border-[#1A1A1A] transition-all focus:outline-none relative"
                id={`role-preset-${role.id}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`inline-block px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    role.category === "engineering" ? "bg-amber-50 text-amber-900 border border-amber-200" :
                    role.category === "product" ? "bg-violet-50 text-violet-900 border border-violet-200" :
                    role.category === "data" ? "bg-blue-50 text-blue-900 border border-blue-200" :
                    role.category === "design" ? "bg-rose-50 text-rose-900 border border-rose-200" :
                    "bg-emerald-50 text-emerald-950 border border-emerald-200"
                  }`}>
                    {role.category}
                  </span>
                  {roleCount > 0 && (
                    <span className="bg-[#1A1A1A] text-white px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider">
                      {roleCount} Runs
                    </span>
                  )}
                </div>
                <h4 className="mt-4 text-lg font-serif italic font-bold text-[#1A1A1A] transition-colors group-hover:underline">
                  {role.name}
                </h4>
                <p className="mt-2 text-xs text-[#1A1A1A]/70 leading-relaxed font-sans line-clamp-2 h-10">
                  {role.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {role.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="bg-[#F2EFE9] border border-[#E5E1DA] px-2 py-0.5 text-[9px] font-bold text-[#1A1A1A]/70 uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-[#E5E1DA] flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                  <span>Launch Assessment</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Historical logs portfolio list */}
      <section className="space-y-4 pt-4">
        <h3 className="text-xl font-serif italic text-[#1A1A1A] font-bold tracking-tight border-b border-[#E5E1DA] pb-2">
          Your Preparation Portfolio & History
        </h3>

        {completedSessions.length === 0 ? (
          <div className="border border-[#E5E1DA] bg-white p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-none border border-[#E5E1DA] bg-[#F2EFE9] text-[#1A1A1A]">
              <Search className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold uppercase tracking-widest text-[#1A1A1A]">Empty Portfolio</h4>
              <p className="text-xs text-[#1A1A1A]/60 leading-relaxed max-w-sm mx-auto font-sans">
                You haven't completed any mock interviews yet. Launch your first session to build out your score metrics and study roadmap.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onStartNew}
                className="inline-flex items-center gap-1.5 border border-[#1A1A1A] bg-white text-[#1A1A1A] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] hover:text-white transition-colors"
                id="dashboard-cta-first-btn"
              >
                Go to Setup Form
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden border border-[#E5E1DA] bg-white" id="dashboard-history-table">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E5E1DA] text-left text-xs">
                <thead className="bg-[#F2EFE9] uppercase text-[10px] font-bold text-[#1A1A1A]/70 tracking-widest">
                  <tr>
                    <th scope="col" className="px-6 py-4">Job Role / LEVEL</th>
                    <th scope="col" className="px-6 py-4">Date Completed</th>
                    <th scope="col" className="px-6 py-4">Questions Answered</th>
                    <th scope="col" className="px-6 py-4 text-center">Score achieved</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1DA] font-sans text-[#1A1A1A] bg-white">
                  {completedSessions.map((session) => {
                    const score = session.overallScore || 0;
                    return (
                      <tr key={session.id} className="hover:bg-[#FCFAF7] transition-colors">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-serif italic font-bold text-[#1A1A1A] text-sm">
                              {session.role}
                            </span>
                            <span className="text-[10px] text-[#1A1A1A]/50 font-bold tracking-wide uppercase mt-0.5">
                              {session.skillLevel}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-[#1A1A1A]/65">
                          {new Date(session.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium text-[#1A1A1A]/80">
                          {Object.values(session.results).length} Questions
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center px-3 py-1 text-xs font-bold border ${
                            score >= 85 ? "bg-emerald-50 text-emerald-800 border-emerald-300" :
                            score >= 70 ? "bg-blue-50 text-blue-800 border-blue-300" :
                            score >= 50 ? "bg-amber-50 text-amber-800 border-amber-300" :
                            "bg-rose-50 text-rose-800 border-rose-300"
                          }`}>
                            {score}%
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <button
                            onClick={() => onReviewSession(session)}
                            className="inline-flex items-center gap-1.5 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] transition-colors px-3 py-1.5"
                            id={`rev-btn-${session.id}`}
                          >
                            <Eye className="h-3 w-3" />
                            Review Portfolio
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Preparation Framework Summary */}
      <div className="border border-[#E5E1DA] bg-[#F2EFE9] p-6">
        <div className="flex gap-4 items-start sm:flex-row flex-col">
          <div className="bg-white p-2.5 text-[#1A1A1A] border border-[#E5E1DA] shrink-0">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Coachable Framework: STAR and Engineering standards</h4>
            <p className="text-xs text-[#1A1A1A]/80 leading-relaxed font-sans">
              To maximize scores, format behavioral responses using the **STAR method** (Situation, Task, Action, Result). For technical topics, discuss design architectures, complexity indices, and alternative tradeoff considerations. Our AI Coach evaluates depth of reasoning, specialized concepts, and conciseness.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
