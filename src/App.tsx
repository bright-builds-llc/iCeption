import { useState } from "react";
import { AppRoot } from "./app/AppRoot";
import { createAppContext } from "./app/bootstrap/createAppContext";

function App() {
  const [appContext] = useState(() =>
    createAppContext(window, {
      isDev: import.meta.env.DEV,
    }),
  );

  return <AppRoot appContext={appContext} />;
}

export default App;
