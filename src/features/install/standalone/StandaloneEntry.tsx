type StandaloneEntryProps = {
  installSource: string;
};

export function StandaloneEntry({
  installSource,
}: StandaloneEntryProps) {
  return (
    <section className="entry-surface entry-surface--standalone">
      <p className="entry-kicker">Standalone entry</p>
      <h1>Welcome to iCeption</h1>
      <p className="entry-body">
        Installed launches will enter the app through this branch. First-run
        and returning-launch behavior will be implemented here in Wave 2.
      </p>
      <p className="entry-meta">Detected from {installSource}</p>
    </section>
  );
}
