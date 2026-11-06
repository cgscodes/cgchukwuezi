// Adapted from StageShow examples/static-card and fade-crop: one cropped,
// dominant Window, compact composition, fixed chrome. The real interface
// replaces fictional dashboard rows; no application interactions are simulated.
import { createRoot } from "react-dom/client";
import { Stage } from "./kit/stage";
import { Window } from "./kit/window";
import "./racklab.css";
export function RackLab() {
  return (
    <Stage
      fill
      width={1120}
      height={700}
      compact={{ below: 600, width: 358, height: 340 }}
      className="racklab-scene"
      tokens={{
        "--ss-font": "Inter, Arial, sans-serif",
        "--ss-surface": "#f4efe7",
        "--ss-canvas": "#e8ddcb",
        "--ss-text": "#61564e",
        "--ss-text-faint": "#61564e",
        "--ss-text-strong": "#342b27",
        "--ss-accent": "#78806a",
      }}
    >
      {() => (
        <Window
          url="cgscodes.github.io/RackLab"
          className="racklab-window"
          lights="grey"
        >
          <img
            className="racklab-full"
            src="/assets/work/racklab-interface.jpg"
            width="1440"
            height="960"
            alt=""
          />
          <img
            className="racklab-detail"
            src="/assets/work/racklab-detail.jpg"
            width="850"
            height="700"
            alt=""
          />
        </Window>
      )}
    </Stage>
  );
}
let stylesheetReady: Promise<void> | undefined;
function loadStylesheet() {
  if (!stylesheetReady) {
    stylesheetReady = new Promise<void>((resolve, reject) => {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "/assets/generated/scenes.css";
      stylesheet.onload = () => resolve();
      stylesheet.onerror = () =>
        reject(new Error("Scene stylesheet unavailable"));
      document.head.append(stylesheet);
    });
  }
  return stylesheetReady;
}
export async function mountScene(host: HTMLElement) {
  if (host.querySelector(".scene-mount")) return;
  // Keep the complete poster visible if the optional stylesheet cannot load.
  await loadStylesheet();
  const mount = document.createElement("div");
  mount.className = "scene-mount";
  mount.setAttribute("aria-hidden", "true");
  host.append(mount);
  createRoot(mount).render(<RackLab />);
}
