import { ArrowUpRight, TrendingUp, Clock, AlertTriangle } from "lucide-react"

export function ImpactMetrics() {
  return (
    <section className="py-24 border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold tracking-[0.06em] text-[#52565E] uppercase mb-3 block">
            Measureable Impact
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#0C0D0E]">
            A reliable baseline for product confidence.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#F9FAFB] border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border border-gray-200/80 mb-6 shadow-sm">
                <Clock className="w-5 h-5 text-[#1B4FFF]" />
              </div>
              <div className="flex items-baseline gap-1 text-5xl font-black text-[#0C0D0E] mb-2 tracking-tight">
                40<span className="text-base font-semibold text-[#52565E]">hrs</span>
              </div>
              <h3 className="text-base font-bold text-[#0C0D0E] mb-2">Saved per project</h3>
              <p className="text-xs text-[#52565E] leading-relaxed">
                By bypassing weeks of manual competitor analysis, search research, and strategic deck creation.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-[10px] font-bold text-[#1B4FFF] uppercase tracking-wider">
              <span>View source reports</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#F9FAFB] border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border border-gray-200/80 mb-6 shadow-sm">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex items-baseline gap-1 text-5xl font-black text-[#0C0D0E] mb-2 tracking-tight">
                10x
              </div>
              <h3 className="text-base font-bold text-[#0C0D0E] mb-2">Launch confidence</h3>
              <p className="text-xs text-[#52565E] leading-relaxed">
                Grounded in objective validation scores cross-referenced with live Reddit and Hacker News data.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-wider">
              <span>Explore algorithms</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#F9FAFB] border border-gray-200/60 rounded-2xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
            <div>
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border border-gray-200/80 mb-6 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-1 text-5xl font-black text-[#0C0D0E] mb-2 tracking-tight">
                $0
              </div>
              <h3 className="text-base font-bold text-[#0C0D0E] mb-2">Wasted engineering</h3>
              <p className="text-xs text-[#52565E] leading-relaxed">
                Identify showstopping technical, positioning, or monetization risks before writing a single line of code.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-[10px] font-bold text-amber-600 uppercase tracking-wider">
              <span>Read case studies</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
