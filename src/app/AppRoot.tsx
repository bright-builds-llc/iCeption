import type { AppContext } from "./bootstrap/createAppContext";

type AppRootProps = {
  appContext: AppContext;
};

export function AppRoot({ appContext }: AppRootProps) {
  return (
    <main
      className="app-shell"
      data-install-context={appContext.installContext.kind}
      data-install-source={appContext.installContext.source}
    >
      <section className="entry-panel">
        <p className="entry-kicker">Phase 1 bootstrap</p>
        <h1>iCeption</h1>
        <p className="entry-body">
          The install entry flow is being wired up in this phase. Browser and
          standalone paths will branch from this root app.
        </p>
        <p className="entry-meta">
          Current mode: {appContext.installContext.kind} via{" "}
          {appContext.installContext.source}
        </p>
      </section>
    </main>
  );
}
