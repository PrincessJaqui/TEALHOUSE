import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { installNumberInputGuard } from "./app/lib/number-input-guard.ts";
import "./styles/index.css";

// Stops a trackpad scroll rewriting whatever number input sits under the
// cursor. Installed before render so it covers every field on every page.
installNumberInputGuard();

createRoot(document.getElementById("root")!).render(<App />);
