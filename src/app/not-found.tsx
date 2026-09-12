import { Section, Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section tone="light" className="py-32 text-center">
      <Container>
        <p className="text-sm font-bold uppercase tracking-widest text-gold-600">404</p>
        <h1 className="mt-3 text-3xl font-bold text-navy-950">Page not found</h1>
        <p className="mt-3 text-navy-500">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <LinkButton href="/" className="mt-8">
          Back to Home
        </LinkButton>
      </Container>
    </Section>
  );
}
