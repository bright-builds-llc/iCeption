import type { AppContext } from "./bootstrap/createAppContext";
import { BrowserInstallFlow } from "../features/install/browser/BrowserInstallFlow";
import { StandaloneEntry } from "../features/install/standalone/StandaloneEntry";

type AppRootProps = {
  appContext: AppContext;
};

export function AppRoot({ appContext }: AppRootProps) {
  const content =
    appContext.installContext.kind === "standalone" ? (
      <StandaloneEntry installSource={appContext.installContext.source} />
    ) : (
      <BrowserInstallFlow installSource={appContext.installContext.source} />
    );

  return (
    <main
      className="app-shell"
      data-install-context={appContext.installContext.kind}
      data-install-source={appContext.installContext.source}
    >
      {content}
    </main>
  );
}
