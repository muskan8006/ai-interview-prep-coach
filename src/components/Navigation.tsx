import React from "react";
import { Briefcase, BarChart2, Clock, PlayCircle } from "lucide-react";

interface NavigationProps {
  currentTab: "dashboard" | "setup" | "simulating" | "results";
  activeSessionId: string | null;
  onTabChange: (tab: "dashboard" | "setup" | "simulating" | "results") => void;
}

export default function Navigation({ currentTab, activeSessionId, onTabChange }: NavigationProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E5E1DA] bg-[#FCFAF7]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Name */}
        <button 
          onClick={() => onTabChange("dashboard")}
          className="flex items-center gap-3 transition-transform hover:scale-[1.01] focus:outline-none"
          id="nav-logo-btn"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-[#1A1A1A] text-white shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-serif italic font-extrabold tracking-tight text-[#1A1A1A]">
              PrepCoach <span className="text-slate-500 font-sans not-italic font-bold text-xs">AI</span>
            </h1>
            <p className="font-sans text-[9px] font-bold tracking-[0.2em] text-[#1A1A1A] opacity-40 uppercase">
              VANTAGE INTERVIEW EDITION
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" id="nav-desktop-links">
          <button
            id="nav-dashboard"
            onClick={() => onTabChange("dashboard")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              currentTab === "dashboard"
                ? "bg-[#1A1A1A] text-white rounded-none"
                : "text-[#1A1A1A]/70 hover:bg-[#F2EFE9] hover:text-[#1A1A1A]"
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Coaching Dashboard
          </button>

          <button
            id="nav-setup"
            onClick={() => onTabChange("setup")}
            disabled={currentTab === "simulating"}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              currentTab === "setup"
                ? "bg-[#1A1A1A] text-white rounded-none"
                : "text-[#1A1A1A]/70 hover:bg-[#F2EFE9] hover:text-[#1A1A1A]"
            } ${currentTab === "simulating" ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <PlayCircle className="h-3.5 w-3.5" />
            New Simulation
          </button>

          {activeSessionId && (
            <button
              id="nav-active-session"
              onClick={() => onTabChange("simulating")}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 animate-pulse"
            >
              <Clock className="h-3.5 w-3.5" />
              Live Interview
            </button>
          )}
        </nav>

        {/* Real-time Status Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[#E5E1DA] bg-white text-[#1A1A1A]/80 text-[10px] font-bold uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Assessor Active
          </div>
          <button
            onClick={() => onTabChange("setup")}
            disabled={currentTab === "simulating"}
            className="flex items-center gap-1.5 bg-[#1A1A1A] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-none hover:bg-[#2D2D2D] active:translate-y-[1px] shadow-sm transition-all disabled:opacity-40 disabled:pointer-events-none"
            id="nav-primary-start-btn"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            Launch Coach
          </button>
        </div>

      </div>
    </header>
  );
}
