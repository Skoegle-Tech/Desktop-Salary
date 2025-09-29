import { app as t, BrowserWindow as a } from "electron";
import { createRequire as w } from "node:module";
import { fileURLToPath as m } from "node:url";
import n from "node:path";
w(import.meta.url);
const d = n.dirname(m(import.meta.url));
process.env.APP_ROOT = n.join(d, "..");
const l = process.env.VITE_DEV_SERVER_URL, _ = n.join(process.env.APP_ROOT, "dist-electron"), c = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = l ? n.join(process.env.APP_ROOT, "public") : c;
let e = null;
function p() {
  e = new a({
    width: 900,
    height: 700,
    autoHideMenuBar: !0,
    title: "PaySlipGenerator",
    // ✅ window title
    icon: n.join(process.env.VITE_PUBLIC, "LOGO.png"),
    // ✅ app icon
    webPreferences: {
      preload: n.join(d, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), e.setMenu(null), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), l ? e.loadURL(l) : e.loadFile(n.join(c, "index.html")), l || (e.webContents.on("context-menu", (s) => s.preventDefault()), e.webContents.on("before-input-event", (s, o) => {
    o.control && o.shift && o.key.toLowerCase() === "i" && s.preventDefault();
  })), e.webContents.session.on("will-download", (s, o) => {
    const r = n.join(t.getPath("downloads"), o.getFilename());
    o.setSavePath(r), o.on("updated", (f, i) => {
      i === "progressing" && (o.isPaused() ? console.log("Download is paused") : console.log(`Received bytes: ${o.getReceivedBytes()}`));
    }), o.once("done", (f, i) => {
      console.log(i === "completed" ? `Download completed: ${r}` : `Download failed: ${i}`);
    });
  });
}
t.setName("PaySlipGenerator");
t.on("window-all-closed", () => {
  process.platform !== "darwin" && (t.quit(), e = null);
});
t.on("activate", () => {
  a.getAllWindows().length === 0 && p();
});
t.whenReady().then(p);
export {
  _ as MAIN_DIST,
  c as RENDERER_DIST,
  l as VITE_DEV_SERVER_URL
};
