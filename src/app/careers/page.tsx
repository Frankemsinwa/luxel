'use client'

import StaticPage from "@/components/StaticPage";

export default function CareersPage() {
  return (
    <StaticPage 
      title="Careers at Luxel" 
      subtitle="Help us build the future of premium travel. We're looking for visionary thinkers and doers."
    >
      <div className="space-y-16">
        <section>
          <h2 className="text-3xl font-bold text-zinc-900 mb-8 tracking-tight">Open Roles</h2>
          <div className="space-y-4">
            {[
              { role: "Senior Frontend Engineer", dept: "Engineering", type: "Remote" },
              { role: "Product Designer", dept: "Design", type: "London / Hybrid" },
              { role: "Luxury Travel Concierge", dept: "Operations", type: "Dubai / Remote" },
              { role: "Growth Marketing Manager", dept: "Marketing", type: "New York" }
            ].map((job, i) => (
              <div key={i} className="group p-8 rounded-2xl border border-zinc-100 bg-white hover:border-amber hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 group-hover:text-amber transition-colors">{job.role}</h3>
                  <div className="flex gap-4 mt-2">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">{job.dept}</span>
                    <span className="text-xs font-medium text-amber uppercase tracking-widest">{job.type}</span>
                  </div>
                </div>
                <button className="px-8 py-3 rounded-xl border border-zinc-200 text-sm font-bold tracking-widest group-hover:bg-black group-hover:text-white group-hover:border-black transition-all">
                  APPLY
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-zinc-50 p-12 rounded-[3rem] text-center border border-zinc-100">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">Don't see your role?</h2>
          <p className="text-zinc-500 max-w-lg mx-auto mb-8">
            We're always looking for talented individuals who are passionate about travel and technology. Send us your resume anyway!
          </p>
          <a href="mailto:careers@luxel.com" className="text-amber font-bold tracking-widest border-b-2 border-amber pb-1 hover:text-amber-dark hover:border-amber-dark transition-all">
            CAREERS@LUXEL.COM
          </a>
        </section>
      </div>
    </StaticPage>
  );
}
