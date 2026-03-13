import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Image src="/logo.png" alt="Luxel Logo" width={140} height={40} />
            <p className="text-body text-zinc-500 leading-relaxed max-w-xs">
              Your premium partner for worldwide travel. We make luxury accessible and booking seamless.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:border-amber hover:text-amber transition-colors cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-current rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-heading-sm mb-8">Resources</h4>
            <ul className="space-y-4 text-body text-zinc-500">
              <li className="hover:text-amber cursor-pointer">About Us</li>
              <li className="hover:text-amber cursor-pointer">Contact Us</li>
              <li className="hover:text-amber cursor-pointer">Book your stay</li>
              <li className="hover:text-amber cursor-pointer">Become a Host</li>
              <li className="hover:text-amber cursor-pointer">Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="text-heading-sm mb-8">Support</h4>
            <ul className="space-y-4 text-body text-zinc-500">
              <li className="hover:text-amber cursor-pointer">Help Center</li>
              <li className="hover:text-amber cursor-pointer">Safety Information</li>
              <li className="hover:text-amber cursor-pointer">Cancellation Option</li>
              <li className="hover:text-amber cursor-pointer">FAQs</li>
            </ul>
          </div>
          <div>
            <h4 className="text-heading-sm mb-8">Contact</h4>
            <ul className="space-y-4 text-body text-zinc-500">
              <li>+234 813 156 7255</li>
              <li>luxelflight@gmail.com</li>
              <li>suite D35, Iyemi plaza,<br />Gudu, Abuja</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-caption font-medium text-zinc-600 uppercase tracking-widest">
          <div className="flex gap-8">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Use</span>
            <span className="hover:text-zinc-400 cursor-pointer">Sales and refund</span>
            <span className="hover:text-zinc-400 cursor-pointer">Legal</span>
            <span className="hover:text-zinc-400 cursor-pointer">Site Map</span>
          </div>
          <p>Copywrite 2026 Luxel All right reserved</p>
        </div>
      </div>
    </footer>
  );
}
