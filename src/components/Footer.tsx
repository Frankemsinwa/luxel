import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const resources = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Book your stay", href: "/hotels" },
    { name: "Become a Host", href: "/become-a-host" },
    { name: "Careers", href: "/careers" }
  ];

  const support = [
    { name: "Help Center", href: "/help" },
    { name: "Safety Information", href: "/safety" },
    { name: "Cancellation Option", href: "/cancellation" },
    { name: "FAQs", href: "/faqs" }
  ];

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
              {resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-amber transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-heading-sm mb-8">Support</h4>
            <ul className="space-y-4 text-body text-zinc-500">
              {support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-amber transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
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
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Use</Link>
            <Link href="/refund-policy" className="hover:text-zinc-400 transition-colors">Sales and refund</Link>
            <Link href="/legal" className="hover:text-zinc-400 transition-colors">Legal</Link>
            <Link href="/sitemap" className="hover:text-zinc-400 transition-colors">Site Map</Link>
          </div>
          <p>Copywrite 2026 Luxel All right reserved</p>
        </div>
      </div>
    </footer>
  );
}
