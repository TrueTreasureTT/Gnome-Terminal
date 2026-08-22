import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c3e14a67"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/workspaces/Gnome-Terminal/frontend/src/App.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
import Terminal from "/src/Terminal.tsx";
export default function App({ backendUrl }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "app", children: [
    /* @__PURE__ */ jsxDEV("header", { className: "header", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "window-title", children: "Terminal" }, void 0, false, {
        fileName: "/workspaces/Gnome-Terminal/frontend/src/App.tsx",
        lineNumber: 29,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "window-subtitle", children: "Ubuntu-style terminal" }, void 0, false, {
        fileName: "/workspaces/Gnome-Terminal/frontend/src/App.tsx",
        lineNumber: 30,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/workspaces/Gnome-Terminal/frontend/src/App.tsx",
      lineNumber: 28,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "main", children: /* @__PURE__ */ jsxDEV(Terminal, { url: backendUrl }, void 0, false, {
      fileName: "/workspaces/Gnome-Terminal/frontend/src/App.tsx",
      lineNumber: 33,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/workspaces/Gnome-Terminal/frontend/src/App.tsx",
      lineNumber: 32,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/workspaces/Gnome-Terminal/frontend/src/App.tsx",
    lineNumber: 27,
    columnNumber: 5
  }, this);
}
_c = App;
var _c;
$RefreshReg$(_c, "App");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/workspaces/Gnome-Terminal/frontend/src/App.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/workspaces/Gnome-Terminal/frontend/src/App.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBU1E7Ozs7Ozs7Ozs7Ozs7Ozs7QUFSUixPQUFPQSxjQUFjO0FBSXJCLHdCQUF3QkMsSUFBSSxFQUFFQyxXQUFrQixHQUFHO0FBQ2pELFNBQ0UsdUJBQUMsU0FBSSxXQUFVLE9BQ2I7QUFBQSwyQkFBQyxZQUFPLFdBQVUsVUFDaEI7QUFBQSw2QkFBQyxTQUFJLFdBQVUsZ0JBQWUsd0JBQTlCO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBc0M7QUFBQSxNQUN0Qyx1QkFBQyxTQUFJLFdBQVUsbUJBQWtCLHFDQUFqQztBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQXNEO0FBQUEsU0FGeEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUdBO0FBQUEsSUFDQSx1QkFBQyxVQUFLLFdBQVUsUUFDZCxpQ0FBQyxZQUFTLEtBQUtBLGNBQWY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUEwQixLQUQ1QjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBRUE7QUFBQSxPQVBGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FRQTtBQUVKO0FBQUNDLEtBWnVCRjtBQUFHLElBQUFFO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbIlRlcm1pbmFsIiwiQXBwIiwiYmFja2VuZFVybCIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkFwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFRlcm1pbmFsIGZyb20gJy4vVGVybWluYWwnXG5cbnR5cGUgUHJvcHMgPSB7IGJhY2tlbmRVcmw6IHN0cmluZyB9XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IGJhY2tlbmRVcmwgfTogUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImFwcFwiPlxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJoZWFkZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3aW5kb3ctdGl0bGVcIj5UZXJtaW5hbDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndpbmRvdy1zdWJ0aXRsZVwiPlVidW50dS1zdHlsZSB0ZXJtaW5hbDwvZGl2PlxuICAgICAgPC9oZWFkZXI+XG4gICAgICA8bWFpbiBjbGFzc05hbWU9XCJtYWluXCI+XG4gICAgICAgIDxUZXJtaW5hbCB1cmw9e2JhY2tlbmRVcmx9IC8+XG4gICAgICA8L21haW4+XG4gICAgPC9kaXY+XG4gIClcbn1cbiJdLCJmaWxlIjoiL3dvcmtzcGFjZXMvR25vbWUtVGVybWluYWwvZnJvbnRlbmQvc3JjL0FwcC50c3gifQ==
