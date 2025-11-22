export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/20 px-4 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl">{children}</div>
    </div>
  );
}
