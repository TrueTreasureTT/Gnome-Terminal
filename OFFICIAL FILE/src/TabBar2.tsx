import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/TabBar.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c3e14a67"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
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
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/workspaces/Gnome-Terminal/frontend/src/TabBar.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
export default function TabBar({ sessions, activeId, onSelect, onClose, onNew }) {
  return /* @__PURE__ */ jsxDEV("div", { className: "terminal-tabs", role: "tablist", "aria-label": "Terminal tabs", children: [
    sessions.map(
      (session) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: `terminal-tab ${session.id === activeId ? "active" : ""}`,
          onClick: () => onSelect(session.id),
          role: "tab",
          "aria-selected": session.id === activeId,
          children: [
            /* @__PURE__ */ jsxDEV("span", { className: "terminal-tab-title", children: session.title }, void 0, false, {
              fileName: "/workspaces/Gnome-Terminal/frontend/src/TabBar.tsx",
              lineNumber: 42,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV(
              "span",
              {
                className: "terminal-tab-close",
                onClick: (event) => {
                  event.stopPropagation();
                  onClose(session.id);
                },
                "aria-label": `Close ${session.title}`,
                children: "×"
              },
              void 0,
              false,
              {
                fileName: "/workspaces/Gnome-Terminal/frontend/src/TabBar.tsx",
                lineNumber: 43,
                columnNumber: 11
              },
              this
            )
          ]
        },
        session.id,
        true,
        {
          fileName: "/workspaces/Gnome-Terminal/frontend/src/TabBar.tsx",
          lineNumber: 35,
          columnNumber: 7
        },
        this
      )
    ),
    /* @__PURE__ */ jsxDEV("button", { className: "terminal-new-tab", onClick: onNew, "aria-label": "New terminal tab", children: "+" }, void 0, false, {
      fileName: "/workspaces/Gnome-Terminal/frontend/src/TabBar.tsx",
      lineNumber: 55,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/workspaces/Gnome-Terminal/frontend/src/TabBar.tsx",
    lineNumber: 33,
    columnNumber: 5
  }, this);
}
_c = TabBar;
var _c;
$RefreshReg$(_c, "TabBar");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/workspaces/Gnome-Terminal/frontend/src/TabBar.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/workspaces/Gnome-Terminal/frontend/src/TabBar.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBc0JVOzs7Ozs7Ozs7Ozs7Ozs7O0FBWFYsd0JBQXdCQSxPQUFPLEVBQUVDLFVBQVVDLFVBQVVDLFVBQVVDLFNBQVNDLE1BQWEsR0FBRztBQUN0RixTQUNFLHVCQUFDLFNBQUksV0FBVSxpQkFBZ0IsTUFBSyxXQUFVLGNBQVcsaUJBQ3RESjtBQUFBQSxhQUFTSztBQUFBQSxNQUFJLENBQUNDLFlBQ2I7QUFBQSxRQUFDO0FBQUE7QUFBQSxVQUVDLFdBQVcsZ0JBQWdCQSxRQUFRQyxPQUFPTixXQUFXLFdBQVcsRUFBRTtBQUFBLFVBQ2xFLFNBQVMsTUFBTUMsU0FBU0ksUUFBUUMsRUFBRTtBQUFBLFVBQ2xDLE1BQUs7QUFBQSxVQUNMLGlCQUFlRCxRQUFRQyxPQUFPTjtBQUFBQSxVQUU5QjtBQUFBLG1DQUFDLFVBQUssV0FBVSxzQkFBc0JLLGtCQUFRRSxTQUE5QztBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUFvRDtBQUFBLFlBQ3BEO0FBQUEsY0FBQztBQUFBO0FBQUEsZ0JBQ0MsV0FBVTtBQUFBLGdCQUNWLFNBQVMsQ0FBQ0MsVUFBVTtBQUNsQkEsd0JBQU1DLGdCQUFnQjtBQUN0QlAsMEJBQVFHLFFBQVFDLEVBQUU7QUFBQSxnQkFDcEI7QUFBQSxnQkFDQSxjQUFZLFNBQVNELFFBQVFFLEtBQUs7QUFBQSxnQkFBRztBQUFBO0FBQUEsY0FOdkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBU0E7QUFBQTtBQUFBO0FBQUEsUUFoQktGLFFBQVFDO0FBQUFBLFFBRGY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQWtCQTtBQUFBLElBQ0Q7QUFBQSxJQUNELHVCQUFDLFlBQU8sV0FBVSxvQkFBbUIsU0FBU0gsT0FBTyxjQUFXLG9CQUFtQixpQkFBbkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFvRjtBQUFBLE9BdEJ0RjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBdUJBO0FBRUo7QUFBQ08sS0EzQnVCWjtBQUFNLElBQUFZO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbIlRhYkJhciIsInNlc3Npb25zIiwiYWN0aXZlSWQiLCJvblNlbGVjdCIsIm9uQ2xvc2UiLCJvbk5ldyIsIm1hcCIsInNlc3Npb24iLCJpZCIsInRpdGxlIiwiZXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJfYyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJUYWJCYXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB0eXBlIHsgVGVybWluYWxTZXNzaW9uIH0gZnJvbSAnLi9UZXJtaW5hbFNlc3Npb24nXG5cbnR5cGUgUHJvcHMgPSB7XG4gIHNlc3Npb25zOiBUZXJtaW5hbFNlc3Npb25bXVxuICBhY3RpdmVJZDogbnVtYmVyXG4gIG9uU2VsZWN0OiAoaWQ6IG51bWJlcikgPT4gdm9pZFxuICBvbkNsb3NlOiAoaWQ6IG51bWJlcikgPT4gdm9pZFxuICBvbk5ldzogKCkgPT4gdm9pZFxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBUYWJCYXIoeyBzZXNzaW9ucywgYWN0aXZlSWQsIG9uU2VsZWN0LCBvbkNsb3NlLCBvbk5ldyB9OiBQcm9wcykge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidGVybWluYWwtdGFic1wiIHJvbGU9XCJ0YWJsaXN0XCIgYXJpYS1sYWJlbD1cIlRlcm1pbmFsIHRhYnNcIj5cbiAgICAgIHtzZXNzaW9ucy5tYXAoKHNlc3Npb24pID0+IChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGtleT17c2Vzc2lvbi5pZH1cbiAgICAgICAgICBjbGFzc05hbWU9e2B0ZXJtaW5hbC10YWIgJHtzZXNzaW9uLmlkID09PSBhY3RpdmVJZCA/ICdhY3RpdmUnIDogJyd9YH1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblNlbGVjdChzZXNzaW9uLmlkKX1cbiAgICAgICAgICByb2xlPVwidGFiXCJcbiAgICAgICAgICBhcmlhLXNlbGVjdGVkPXtzZXNzaW9uLmlkID09PSBhY3RpdmVJZH1cbiAgICAgICAgPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRlcm1pbmFsLXRhYi10aXRsZVwiPntzZXNzaW9uLnRpdGxlfTwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidGVybWluYWwtdGFiLWNsb3NlXCJcbiAgICAgICAgICAgIG9uQ2xpY2s9eyhldmVudCkgPT4ge1xuICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgICBvbkNsb3NlKHNlc3Npb24uaWQpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgYXJpYS1sYWJlbD17YENsb3NlICR7c2Vzc2lvbi50aXRsZX1gfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIMOXXG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICkpfVxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJ0ZXJtaW5hbC1uZXctdGFiXCIgb25DbGljaz17b25OZXd9IGFyaWEtbGFiZWw9XCJOZXcgdGVybWluYWwgdGFiXCI+KzwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApXG59XG4iXSwiZmlsZSI6Ii93b3Jrc3BhY2VzL0dub21lLVRlcm1pbmFsL2Zyb250ZW5kL3NyYy9UYWJCYXIudHN4In0=
