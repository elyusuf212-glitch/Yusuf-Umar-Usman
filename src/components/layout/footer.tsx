import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { FOOTER_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-navy-900/60 bg-navy-950 text-navy-200">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Logo dark />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">{SITE.tagline}</p>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-navy-400">
              A youth leadership, mentorship, learning, networking and civic-impact platform for young
              changemakers across Nigeria and Africa.
            </p>
          </div>

          <FooterColumn title="Platform" links={FOOTER_LINKS.platform} />
          <FooterColumn title="Organisation" links={FOOTER_LINKS.organisation} />
          <FooterColumn title="Account" links={FOOTER_LINKS.account} />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-navy-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} CitizensNexus. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link href="/certificates/verify" className="hover:text-white">
              Verify Certificate
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-white">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-navy-300 transition hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
