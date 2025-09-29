import ReactDOM from "react-dom/client";
import App from "./App.jsx";

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(<App />);
}

// Listen to messages from Electron main process via contextBridge
if (window.ipcRenderer) {
  window.ipcRenderer.on("main-process-message", (_event, message) => {
    console.log("Message from main process:", message);
  });
}
