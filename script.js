import { initFirebase } from "./firebase.js";
import { startSplashTimeline } from "./animations.js";
import { initLanguageSwitcher } from "./i18n.js";
import { initMenuPanel } from "./menu.js";

const db = initFirebase();

initLanguageSwitcher();

startSplashTimeline(() => {
  initMenuPanel(db);
});
