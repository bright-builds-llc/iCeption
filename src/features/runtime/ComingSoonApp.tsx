import type { RuntimeApp } from "./appRegistry";

type ComingSoonAppProps = {
  app: RuntimeApp;
};

export function ComingSoonApp({
  app,
}: ComingSoonAppProps) {
  return (
    <section className="coming-soon-app">
      <div className="coming-soon-app__badge">Coming Soon</div>
      <p className="coming-soon-app__body">
        {app.label} is staged in the launcher now and will get its full behavior
        in a later phase.
      </p>
      <div className="coming-soon-app__orb" aria-hidden="true" />
    </section>
  );
}
