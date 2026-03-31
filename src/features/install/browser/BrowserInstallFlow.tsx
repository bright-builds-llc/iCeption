type BrowserInstallFlowProps = {
  installSource: string;
};

export function BrowserInstallFlow({
  installSource,
}: BrowserInstallFlowProps) {
  return (
    <section className="entry-surface entry-surface--browser">
      <p className="entry-kicker">Browser preview</p>
      <h1>Install iCeption</h1>
      <p className="entry-body">
        Safari visitors will see an install-first flow here. The full Phase 1
        browser funnel will sit on this branch.
      </p>
      <p className="entry-meta">Detected from {installSource}</p>
    </section>
  );
}
