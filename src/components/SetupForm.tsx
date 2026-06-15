import React, { useState } from "react";
import { PRESET_ROLES, SKILL_LEVELS } from "../data";
import { Sparkles, Briefcase, Plus, Play, Settings } from "lucide-react";

interface SetupFormProps {
  initialRole?: string;
  onLaunch: (roleName: string, levelName: string) => void;
  isGenerating: boolean;
}

export default function SetupForm({ initialRole, onLaunch, isGenerating }: SetupFormProps) {
  // Find predefined role if applicable
  const foundPreset = PRESET_ROLES.find(r => r.id === initialRole || r.name.toLowerCase() === initialRole?.toLowerCase());
  
  const [selectedPresetId, setSelectedPresetId] = useState<string>(foundPreset?.id || "software-engineer");
  const [customRole, setCustomRole] = useState<string>(foundPreset ? "" : (initialRole || ""));
  const [skillLevel, setSkillLevel] = useState<string>("mid");
  const [isCustomMode, setIsCustomMode] = useState<boolean>(!foundPreset && !!initialRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRoleRaw = isCustomMode ? customRole : (PRESET_ROLES.find(r => r.id === selectedPresetId)?.name || "Software Engineer");
    const finalRole = finalRoleRaw.trim() || "Software Engineer";
    
    // Find skill level label
    const levelLabel = SKILL_LEVELS.find(l => l.id === skillLevel)?.name || "Mid-Level Professional";
    
    onLaunch(finalRole, levelLabel);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in" id="setup-form-root">
      
      {/* Back Heading */}
      <div className="space-y-2 text-center sm:text-left border-b border-[#E5E1DA] pb-4">
        <h2 className="text-3xl font-serif italic text-[#1A1A1A] font-bold flex items-center justify-center sm:justify-start gap-2">
          <Settings className="h-6 w-6 text-[#1A1A1A]" />
          Setup Mock Interview Session
        </h2>
        <p className="text-xs uppercase tracking-widest text-[#1A1A1A]/60 font-sans leading-relaxed">
          Your AI interviewer will construct a customized sequence of behavioral, technical, and situational problems tailored precisely to your targets.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-[#E5E1DA] bg-white p-6 sm:p-8 space-y-8">
        
        {/* Step 1: SELECT ROLE */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest font-sans">
            1. Target Job Role
          </label>
          
          {/* Preset Buttons Grid */}
          {!isCustomMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PRESET_ROLES.map((role) => {
                  const isSelected = selectedPresetId === role.id;
                  return (
                    <button
                      type="button"
                      key={role.id}
                      onClick={() => setSelectedPresetId(role.id)}
                      className={`flex items-start gap-3 p-4 border text-left transition-all rounded-none ${
                        isSelected
                          ? "border-[#1A1A1A] bg-[#F2EFE9]"
                          : "border-[#E5E1DA] hover:border-[#1A1A1A]/50 bg-white"
                      }`}
                      id={`preset-choice-${role.id}`}
                    >
                      <div className={`mt-0.5 border p-2 rounded-none ${isSelected ? "bg-[#1A1A1A] text-white border-transparent" : "bg-[#F2EFE9] text-[#1A1A1A]/80 border-[#E5E1DA]"}`}>
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">{role.name}</h4>
                        <p className="text-[10px] text-[#1A1A1A]/60 mt-1 line-clamp-1">{role.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setIsCustomMode(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] uppercase tracking-wider underline hover:opacity-75 font-sans"
                id="btn-custom-mode-toggle"
              >
                <Plus className="h-3.5 w-3.5" />
                Or type a custom job title (e.g. AI Researcher, iOS Developer)
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g., Senior iOS Engineer, DevOps Architect, Salesforce Developer"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full border border-[#E5E1DA] px-4 py-3.5 text-sm focus:border-[#1A1A1A] focus:outline-none placeholder:text-[#1A1A1A]/30 rounded-none bg-white font-sans text-[#1A1A1A]"
                  id="custom-role-input"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="text-xs font-bold text-[#1A1A1A]/60 uppercase tracking-widest hover:text-[#1A1A1A] underline font-sans"
              >
                ← Back to standard presets selection
              </button>
            </div>
          )}
        </div>

        {/* Step 2: CHOOSE DIFFICULTY LEVEL */}
        <div className="space-y-4">
          <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-widest font-sans">
            2. Desired Seniority & Skill Level
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SKILL_LEVELS.map((level) => {
              const isSelected = skillLevel === level.id;
              return (
                <button
                  type="button"
                  key={level.id}
                  onClick={() => setSkillLevel(level.id)}
                  className={`flex flex-col border p-4 text-left transition-all rounded-none ${
                    isSelected
                      ? "border-[#1A1A1A] bg-[#F2EFE9]"
                      : "border-[#E5E1DA] hover:border-[#1A1A1A]/50 bg-white"
                  }`}
                  id={`skill-choice-${level.id}`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">{level.name}</span>
                  <span className="text-[10px] text-[#1A1A1A]/60 mt-1 leading-relaxed font-sans">{level.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informative tips box */}
        <div className="border border-[#E5E1DA] bg-[#F2EFE9] p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
            <Sparkles className="h-4 w-4 text-[#1A1A1A]" />
            AI Generation Blueprint
          </div>
          <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed font-sans">
            By proceeding, Gemini will generate **5 targeted mock evaluation prompts**. For each question, you can type your answer and the coach will run an immediate, diagnostic, numerical score assessment.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isGenerating}
          className="w-full relative flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-6 py-4 text-xs font-bold uppercase tracking-widest rounded-none hover:bg-[#2D2D2D] shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none"
          id="setup-submit-btn"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generative AI formulating interview sequence...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 h-3.5 fill-current" />
              <span>Launch AI Simulator</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
