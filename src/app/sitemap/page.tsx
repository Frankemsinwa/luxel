'use client'

import StaticPage from "@/components/StaticPage";
import Link from "next/link";

export default function SitemapPage() {
  const sections = [
    {
      title: "Main",
      links: [
        { name: "Home", href: "/" },
        { name: "Flights", href: "/flights" },
        { name: "Tours", href: "/tour" },
        { name: "Hotels", href: "/hotels" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Become a Host", href: "/become-a-host" },
        { name: "Careers", href: "/careers" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Safety Info", href: "/safety" },
        { name: "Cancellation", href: "/cancellation" },
        { name: "FAQs", href: "/faqs" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Use", href: "/terms" },
        { name: "Refund Policy", href: "/refund-policy" },
        { name: "Legal", href: "/legal" }
      ]
    }
  ];

  return (
    <StaticPage 
      title="Site Map" 
      subtitle="A comprehensive directory of all Luxel pages."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {sections.map((section, i) => (
          <div key={i} className="space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 border-b border-zinc-100 pb-4">{section.title}</h2>
            <ul className="space-y-4">
              {section.links.map((link, j) => (
                <li key={j}>
                  <Link href={link.href} className="text-zinc-600 hover:text-amber transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}
