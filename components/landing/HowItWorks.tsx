import { Terminal, Cpu, LineChart, Search, FileText, CheckCircle2 } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="border-b border-gray-100 py-24 md:py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="mb-20 md:mb-28 text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-bold tracking-[0.06em] text-[#52565E] uppercase mb-3 block">
            The Analysis Pipeline
          </span>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-[#0C0D0E]">
            How we map your startup's destiny.
          </h2>
          <p className="mt-6 text-base text-[#52565E] leading-relaxed">
            Our deterministic parallel-processing architecture is designed to eliminate uncertainty before development begins.
          </p>
        </div>

        <div className="space-y-32">
          
          {/* Step 1: Text Left, Realistic UI Right */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                <Terminal className="h-5 w-5 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-[#0C0D0E]">
                1. Context Initialization
              </h3>
              <p className="text-[#52565E] text-sm sm:text-base leading-relaxed">
                Provide your basic concept. The engine normalizes the description, parses the core market categories, and maps target customer segment profiles.
              </p>
            </div>
            
            {/* Visual Preview */}
            <div className="relative rounded-2xl border border-gray-200 bg-[#F9FAFB] p-8 overflow-hidden h-[340px] flex items-center justify-center shadow-inner">
               <div className="w-full max-w-xs bg-white border border-gray-200 p-5 rounded-xl shadow-lg relative z-10">
                 <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                    <FileText className="h-4 w-4 text-[#1B4FFF]" />
                    <span className="text-xs font-bold text-[#0C0D0E] uppercase tracking-wider">Concept Definition</span>
                 </div>
                 <p className="text-xs text-gray-600 leading-relaxed italic mb-4">
                   "A Figma plugin that translates visual layout grids directly into clean React code..."
                 </p>
                 <div className="space-y-3 border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-semibold">Category</span>
                      <span className="font-semibold text-gray-800">Design-to-Code / DevTools</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-semibold">Target User</span>
                      <span className="font-semibold text-gray-800">Front-End Engineers</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Step 2: UI Left, Text Right */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            
            {/* Visual Preview */}
            <div className="order-2 md:order-1 relative rounded-2xl border border-gray-200 bg-[#F9FAFB] p-8 overflow-hidden h-[340px] flex flex-col items-center justify-center shadow-inner">
               <div className="w-full max-w-xs flex flex-col gap-3 relative z-10">
                 
                 {/* Execution Rows */}
                 <div className="bg-white border border-gray-200 p-3.5 rounded-xl flex items-center gap-3.5 shadow-sm relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                   <div className="h-8 w-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                     <Search className="h-4 w-4 text-green-700" />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center mb-0.5">
                       <span className="text-xs font-bold text-gray-900">Competitor Intel</span>
                       <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Done</span>
                     </div>
                     <p className="text-[10px] text-gray-400 truncate">Found 18 direct solutions</p>
                   </div>
                 </div>
                 
                 <div className="bg-white border border-gray-200 p-3.5 rounded-xl flex items-center gap-3.5 shadow-sm relative overflow-hidden">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                   <div className="h-8 w-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center shrink-0">
                     <Search className="h-4 w-4 text-green-700" />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center mb-0.5">
                       <span className="text-xs font-bold text-gray-900">Reddit Search</span>
                       <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Done</span>
                     </div>
                     <p className="text-[10px] text-gray-400 truncate">Parsed 140+ pain point comments</p>
                   </div>
                 </div>

                 <div className="bg-white border border-blue-200 p-3.5 rounded-xl flex items-center gap-3.5 shadow-md relative overflow-hidden transform scale-[1.02]">
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1B4FFF]"></div>
                   <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                     <Cpu className="h-4 w-4 text-[#1B4FFF] animate-spin" style={{ animationDuration: '3s' }} />
                   </div>
                   <div className="flex-1">
                     <div className="flex justify-between items-center mb-0.5">
                       <span className="text-xs font-bold text-gray-900">Scale Architect</span>
                       <span className="text-[10px] font-bold text-[#1B4FFF] uppercase tracking-wider animate-pulse">Running</span>
                     </div>
                     <p className="text-[10px] text-gray-400 truncate">Modeling $10K MRR path...</p>
                   </div>
                 </div>
               </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                <Cpu className="h-5 w-5 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-[#0C0D0E]">
                2. Parallel Agent Execution
              </h3>
              <p className="text-[#52565E] text-sm sm:text-base leading-relaxed">
                12 specialized analytical agents fire concurrently. They query live web indexes via Serper and Jina AI, search developer boards, and execute financial forecasts.
              </p>
            </div>
          </div>

          {/* Step 3: Text Left, UI Right */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                <LineChart className="h-5 w-5 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-4 text-[#0C0D0E]">
                3. Synthesis & Evaluation
              </h3>
              <p className="text-[#52565E] text-sm sm:text-base leading-relaxed">
                A coordinator agent aggregates all parallel outputs, calculates objective scores across 6 strategic pillars, and delivers a robust, investor-ready report.
              </p>
            </div>
            
            {/* Visual Preview */}
            <div className="relative rounded-2xl border border-gray-200 bg-[#F9FAFB] p-8 overflow-hidden h-[340px] flex items-center justify-center shadow-inner">
               <div className="w-full max-w-xs bg-white border border-gray-200 p-5 rounded-xl shadow-lg relative z-10 flex flex-col">
                 <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                   <div className="flex flex-col">
                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Viability Index</span>
                     <div className="text-3xl font-black text-gray-900">82<span className="text-sm text-gray-400 font-semibold">/100</span></div>
                   </div>
                   <div className="h-10 w-10 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                     <span className="text-xs font-bold text-green-700">Go</span>
                   </div>
                 </div>
                 
                 <div className="space-y-2.5">
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="font-semibold text-gray-700">Market Demand</span>
                       <span className="text-gray-400 font-bold">90/100</span>
                     </div>
                     <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-gray-800 w-[90%]"></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs mb-1">
                       <span className="font-semibold text-gray-700">Technical Feasibility</span>
                       <span className="text-gray-400 font-bold">85/100</span>
                     </div>
                     <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                       <div className="h-full bg-gray-800 w-[85%]"></div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
