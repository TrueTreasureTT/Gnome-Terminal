import {createHotContext as __vite__createHotContext} from "/@vite/client";
import.meta.hot = __vite__createHotContext("/src/Terminal.tsx");
import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c3e14a67";
const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import*as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
    if (!window.$RefreshReg$) {
        throw new Error("@vitejs/plugin-react can't detect preamble. Something is wrong.");
    }
    prevRefreshReg = window.$RefreshReg$;
    prevRefreshSig = window.$RefreshSig$;
    window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/workspaces/Gnome-Terminal/frontend/src/Terminal.tsx");
    window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/node_modules/.vite/deps/react.js?v=c3e14a67";
const useCallback = __vite__cjsImport3_react["useCallback"];
const useEffect = __vite__cjsImport3_react["useEffect"];
const useRef = __vite__cjsImport3_react["useRef"];
const useState = __vite__cjsImport3_react["useState"];
import {TerminalSession} from "/src/TerminalSession.ts";
import TabBar from "/src/TabBar.tsx";
import {shortcuts} from "/src/shortcuts.ts";
const Terminal = ({url}) => {
    _s();
    const containerRef = useRef(null);
    const sessionsRef = useRef([]);
    const nextId = useRef(1);
    const [activeId,setActiveId] = useState(0);
    const [,forceRender] = useState(0);
    const createSession = useCallback( () => {
        const session = new TerminalSession(nextId.current++,url);
        sessionsRef.current.push(session);
        session.connect( () => forceRender( (value) => value + 1));
        session.term.onTitleChange( (title) => {
            session.title = title || "Terminal";
            forceRender( (value) => value + 1);
        }
        );
        return session;
    }
    , [url]);
    const closeSession = useCallback( (id) => {
        const sessions = sessionsRef.current;
        const index = sessions.findIndex( (session2) => session2.id === id);
        if (index < 0)
            return;
        const [session] = sessions.splice(index, 1);
        session.dispose();
        if (sessions.length === 0) {
            const replacement = createSession();
            setActiveId(replacement.id);
        } else if (activeId === id) {
            setActiveId(sessions[Math.max(0, index - 1)].id);
        }
        forceRender( (value) => value + 1);
    }
    , [activeId, createSession]);
    const newSession = useCallback( () => {
        const session = createSession();
        setActiveId(session.id);
        forceRender( (value) => value + 1);
    }
    , [createSession]);
    useEffect( () => {
        const first = createSession();
        setActiveId(first.id);
        return () => {
            sessionsRef.current.forEach( (session) => session.dispose());
            sessionsRef.current = [];
        }
        ;
    }
    , [createSession]);
    useEffect( () => {
        const active2 = sessionsRef.current.find( (session) => session.id === activeId);
        const container = containerRef.current;
        if (!active2 || !container)
            return;
        if (!active2.term.element)
            active2.term.open(container);
        else if (active2.term.element.parentElement !== container)
            container.appendChild(active2.term.element);
        sessionsRef.current.forEach( (session) => {
            if (session.term.element) {
                session.term.element.style.display = session.id === activeId ? "block" : "none";
            }
        }
        );
        requestAnimationFrame( () => {
            active2.resize();
            active2.term.focus();
        }
        );
    }
    , [activeId]);
    useEffect( () => {
        const resize = () => {
            sessionsRef.current.forEach( (session) => {
                if (session.term.element && session.term.element.style.display !== "none") {
                    session.resize();
                }
            }
            );
        }
        ;
        const observer = containerRef.current ? new ResizeObserver(resize) : null;
        if (containerRef.current && observer)
            observer.observe(containerRef.current);
        window.addEventListener("resize", resize);
        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", resize);
        }
        ;
    }
    , []);
    useEffect( () => {
        const onKeyDown = (event) => {
            if (shortcuts.newTab(event)) {
                event.preventDefault();
                newSession();
                return;
            }
            if (shortcuts.closeTab(event)) {
                event.preventDefault();
                if (activeId)
                    closeSession(activeId);
                return;
            }
            if (shortcuts.copy(event)) {
                const active2 = sessionsRef.current.find( (session) => session.id === activeId);
                const selection = active2?.term.getSelection();
                if (selection) {
                    event.preventDefault();
                    navigator.clipboard?.writeText(selection);
                }
                return;
            }
            if (shortcuts.paste(event)) {
                const active2 = sessionsRef.current.find( (session) => session.id === activeId);
                if (active2) {
                    event.preventDefault();
                    navigator.clipboard?.readText().then( (text) => active2.term.paste(text)).catch( () => void 0);
                }
                return;
            }
            if (shortcuts.zoomIn(event) || shortcuts.zoomOut(event) || shortcuts.resetZoom(event)) {
                const active2 = sessionsRef.current.find( (session) => session.id === activeId);
                if (!active2)
                    return;
                event.preventDefault();
                if (shortcuts.zoomIn(event))
                    active2.term.options.fontSize = Math.min(32, (active2.term.options.fontSize ?? 14) + 1);
                if (shortcuts.zoomOut(event))
                    active2.term.options.fontSize = Math.max(8, (active2.term.options.fontSize ?? 14) - 1);
                if (shortcuts.resetZoom(event))
                    active2.term.options.fontSize = 14;
                active2.resize();
            }
        }
        ;
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }
    , [activeId, closeSession, newSession]);
    const active = sessionsRef.current.find( (session) => session.id === activeId);
    return /* @__PURE__ */
    jsxDEV("div", {
        className: "terminal-shell",
        children: [/* @__PURE__ */
        jsxDEV(TabBar, {
            sessions: sessionsRef.current,
            activeId,
            onSelect: setActiveId,
            onClose: closeSession,
            onNew: newSession
        }, void 0, false, {
            fileName: "/workspaces/Gnome-Terminal/frontend/src/Terminal.tsx",
            lineNumber: 164,
            columnNumber: 7
        }, this), /* @__PURE__ */
        jsxDEV("div", {
            className: "terminal-container",
            ref: containerRef
        }, void 0, false, {
            fileName: "/workspaces/Gnome-Terminal/frontend/src/Terminal.tsx",
            lineNumber: 171,
            columnNumber: 7
        }, this), /* @__PURE__ */
        jsxDEV("div", {
            className: "terminal-status",
            "aria-live": "polite",
            children: active?.ws.readyState === WebSocket.OPEN ? "Connected" : "Connecting…"
        }, void 0, false, {
            fileName: "/workspaces/Gnome-Terminal/frontend/src/Terminal.tsx",
            lineNumber: 172,
            columnNumber: 7
        }, this)]
    }, void 0, true, {
        fileName: "/workspaces/Gnome-Terminal/frontend/src/Terminal.tsx",
        lineNumber: 163,
        columnNumber: 5
    }, this);
}
;
_s(Terminal, "J7wewF9hK1Y/lJ9nNDicDV+HiYc=");
_c = Terminal;
export default Terminal;
var _c;
$RefreshReg$(_c, "Terminal");
if (import.meta.hot && !inWebWorker) {
    window.$RefreshReg$ = prevRefreshReg;
    window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
    RefreshRuntime.__hmr_import(import.meta.url).then( (currentExports) => {
        RefreshRuntime.registerExportsForReactRefresh("/workspaces/Gnome-Terminal/frontend/src/Terminal.tsx", currentExports);
        import.meta.hot.accept( (nextExports) => {
            if (!nextExports)
                return;
            const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/workspaces/Gnome-Terminal/frontend/src/Terminal.tsx", currentExports, nextExports);
            if (invalidateMessage)
                import.meta.hot.invalidate(invalidateMessage);
        }
        );
    }
    );
}

//# sourceMappingURL=data:application/json;base64,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IlRhYkJhciIsInNob3J0Y3V0cyIsIlRlcm1pbmFsIiwidXJsIiwiX3MiLCJjb250YWluZXJSZWYiLCJzZXNzaW9uc1JlZiIsIm5leHRJZCIsImFjdGl2ZUlkIiwic2V0QWN0aXZlSWQiLCJmb3JjZVJlbmRlciIsImNyZWF0ZVNlc3Npb24iLCJzZXNzaW9uIiwiY3VycmVudCIsInB1c2giLCJjb25uZWN0IiwidmFsdWUiLCJ0ZXJtIiwib25UaXRsZUNoYW5nZSIsInRpdGxlIiwiY2xvc2VTZXNzaW9uIiwiaWQiLCJzZXNzaW9ucyIsImluZGV4IiwiZmluZEluZGV4Iiwic3BsaWNlIiwiZGlzcG9zZSIsImxlbmd0aCIsInJlcGxhY2VtZW50IiwiTWF0aCIsIm1heCIsIm5ld1Nlc3Npb24iLCJmaXJzdCIsImZvckVhY2giLCJhY3RpdmUiLCJmaW5kIiwiY29udGFpbmVyIiwiZWxlbWVudCIsIm9wZW4iLCJwYXJlbnRFbGVtZW50IiwiYXBwZW5kQ2hpbGQiLCJzdHlsZSIsImRpc3BsYXkiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyZXNpemUiLCJmb2N1cyIsIm9ic2VydmVyIiwiUmVzaXplT2JzZXJ2ZXIiLCJvYnNlcnZlIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImRpc2Nvbm5lY3QiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwib25LZXlEb3duIiwiZXZlbnQiLCJuZXdUYWIiLCJwcmV2ZW50RGVmYXVsdCIsImNsb3NlVGFiIiwiY29weSIsInNlbGVjdGlvbiIsImdldFNlbGVjdGlvbiIsIm5hdmlnYXRvciIsImNsaXBib2FyZCIsIndyaXRlVGV4dCIsInBhc3RlIiwicmVhZFRleHQiLCJ0aGVuIiwidGV4dCIsImNhdGNoIiwidW5kZWZpbmVkIiwiem9vbUluIiwiem9vbU91dCIsInJlc2V0Wm9vbSIsIm9wdGlvbnMiLCJmb250U2l6ZSIsIm1pbiIsIndzIiwicmVhZHlTdGF0ZSIsIldlYlNvY2tldCIsIk9QRU4iLCJfYyJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJUZXJtaW5hbC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFRlcm1pbmFsU2Vzc2lvbiB9IGZyb20gJy4vVGVybWluYWxTZXNzaW9uJ1xuaW1wb3J0IFRhYkJhciBmcm9tICcuL1RhYkJhcidcbmltcG9ydCB7IHNob3J0Y3V0cyB9IGZyb20gJy4vc2hvcnRjdXRzJ1xuXG50eXBlIFByb3BzID0geyB1cmw6IHN0cmluZyB9XG5cbmNvbnN0IFRlcm1pbmFsOiBSZWFjdC5GQzxQcm9wcz4gPSAoeyB1cmwgfSkgPT4ge1xuICBjb25zdCBjb250YWluZXJSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQgfCBudWxsPihudWxsKVxuICBjb25zdCBzZXNzaW9uc1JlZiA9IHVzZVJlZjxUZXJtaW5hbFNlc3Npb25bXT4oW10pXG4gIGNvbnN0IG5leHRJZCA9IHVzZVJlZigxKVxuICBjb25zdCBbYWN0aXZlSWQsIHNldEFjdGl2ZUlkXSA9IHVzZVN0YXRlKDApXG4gIGNvbnN0IFssIGZvcmNlUmVuZGVyXSA9IHVzZVN0YXRlKDApXG5cbiAgY29uc3QgY3JlYXRlU2Vzc2lvbiA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCBzZXNzaW9uID0gbmV3IFRlcm1pbmFsU2Vzc2lvbihuZXh0SWQuY3VycmVudCsrLCB1cmwpXG4gICAgc2Vzc2lvbnNSZWYuY3VycmVudC5wdXNoKHNlc3Npb24pXG4gICAgc2Vzc2lvbi5jb25uZWN0KCgpID0+IGZvcmNlUmVuZGVyKCh2YWx1ZSkgPT4gdmFsdWUgKyAxKSlcbiAgICBzZXNzaW9uLnRlcm0ub25UaXRsZUNoYW5nZSgodGl0bGUpID0+IHtcbiAgICAgIHNlc3Npb24udGl0bGUgPSB0aXRsZSB8fCAnVGVybWluYWwnXG4gICAgICBmb3JjZVJlbmRlcigodmFsdWUpID0+IHZhbHVlICsgMSlcbiAgICB9KVxuICAgIHJldHVybiBzZXNzaW9uXG4gIH0sIFt1cmxdKVxuXG4gIGNvbnN0IGNsb3NlU2Vzc2lvbiA9IHVzZUNhbGxiYWNrKChpZDogbnVtYmVyKSA9PiB7XG4gICAgY29uc3Qgc2Vzc2lvbnMgPSBzZXNzaW9uc1JlZi5jdXJyZW50XG4gICAgY29uc3QgaW5kZXggPSBzZXNzaW9ucy5maW5kSW5kZXgoKHNlc3Npb24pID0+IHNlc3Npb24uaWQgPT09IGlkKVxuICAgIGlmIChpbmRleCA8IDApIHJldHVyblxuXG4gICAgY29uc3QgW3Nlc3Npb25dID0gc2Vzc2lvbnMuc3BsaWNlKGluZGV4LCAxKVxuICAgIHNlc3Npb24uZGlzcG9zZSgpXG5cbiAgICBpZiAoc2Vzc2lvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCByZXBsYWNlbWVudCA9IGNyZWF0ZVNlc3Npb24oKVxuICAgICAgc2V0QWN0aXZlSWQocmVwbGFjZW1lbnQuaWQpXG4gICAgfSBlbHNlIGlmIChhY3RpdmVJZCA9PT0gaWQpIHtcbiAgICAgIHNldEFjdGl2ZUlkKHNlc3Npb25zW01hdGgubWF4KDAsIGluZGV4IC0gMSldLmlkKVxuICAgIH1cbiAgICBmb3JjZVJlbmRlcigodmFsdWUpID0+IHZhbHVlICsgMSlcbiAgfSwgW2FjdGl2ZUlkLCBjcmVhdGVTZXNzaW9uXSlcblxuICBjb25zdCBuZXdTZXNzaW9uID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHNlc3Npb24gPSBjcmVhdGVTZXNzaW9uKClcbiAgICBzZXRBY3RpdmVJZChzZXNzaW9uLmlkKVxuICAgIGZvcmNlUmVuZGVyKCh2YWx1ZSkgPT4gdmFsdWUgKyAxKVxuICB9LCBbY3JlYXRlU2Vzc2lvbl0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBmaXJzdCA9IGNyZWF0ZVNlc3Npb24oKVxuICAgIHNldEFjdGl2ZUlkKGZpcnN0LmlkKVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHNlc3Npb25zUmVmLmN1cnJlbnQuZm9yRWFjaCgoc2Vzc2lvbikgPT4gc2Vzc2lvbi5kaXNwb3NlKCkpXG4gICAgICBzZXNzaW9uc1JlZi5jdXJyZW50ID0gW11cbiAgICB9XG4gIH0sIFtjcmVhdGVTZXNzaW9uXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGFjdGl2ZSA9IHNlc3Npb25zUmVmLmN1cnJlbnQuZmluZCgoc2Vzc2lvbikgPT4gc2Vzc2lvbi5pZCA9PT0gYWN0aXZlSWQpXG4gICAgY29uc3QgY29udGFpbmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnRcbiAgICBpZiAoIWFjdGl2ZSB8fCAhY29udGFpbmVyKSByZXR1cm5cblxuICAgIGlmICghYWN0aXZlLnRlcm0uZWxlbWVudCkgYWN0aXZlLnRlcm0ub3Blbihjb250YWluZXIpXG4gICAgZWxzZSBpZiAoYWN0aXZlLnRlcm0uZWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBjb250YWluZXIpIGNvbnRhaW5lci5hcHBlbmRDaGlsZChhY3RpdmUudGVybS5lbGVtZW50KVxuXG4gICAgc2Vzc2lvbnNSZWYuY3VycmVudC5mb3JFYWNoKChzZXNzaW9uKSA9PiB7XG4gICAgICBpZiAoc2Vzc2lvbi50ZXJtLmVsZW1lbnQpIHtcbiAgICAgICAgc2Vzc2lvbi50ZXJtLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IHNlc3Npb24uaWQgPT09IGFjdGl2ZUlkID8gJ2Jsb2NrJyA6ICdub25lJ1xuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgYWN0aXZlLnJlc2l6ZSgpXG4gICAgICBhY3RpdmUudGVybS5mb2N1cygpXG4gICAgfSlcbiAgfSwgW2FjdGl2ZUlkXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJlc2l6ZSA9ICgpID0+IHtcbiAgICAgIHNlc3Npb25zUmVmLmN1cnJlbnQuZm9yRWFjaCgoc2Vzc2lvbikgPT4ge1xuICAgICAgICBpZiAoc2Vzc2lvbi50ZXJtLmVsZW1lbnQgJiYgc2Vzc2lvbi50ZXJtLmVsZW1lbnQuc3R5bGUuZGlzcGxheSAhPT0gJ25vbmUnKSB7XG4gICAgICAgICAgc2Vzc2lvbi5yZXNpemUoKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IG9ic2VydmVyID0gY29udGFpbmVyUmVmLmN1cnJlbnQgPyBuZXcgUmVzaXplT2JzZXJ2ZXIocmVzaXplKSA6IG51bGxcbiAgICBpZiAoY29udGFpbmVyUmVmLmN1cnJlbnQgJiYgb2JzZXJ2ZXIpIG9ic2VydmVyLm9ic2VydmUoY29udGFpbmVyUmVmLmN1cnJlbnQpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSlcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgb2JzZXJ2ZXI/LmRpc2Nvbm5lY3QoKVxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHJlc2l6ZSlcbiAgICB9XG4gIH0sIFtdKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgb25LZXlEb3duID0gKGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICBpZiAoc2hvcnRjdXRzLm5ld1RhYihldmVudCkpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICBuZXdTZXNzaW9uKClcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBpZiAoc2hvcnRjdXRzLmNsb3NlVGFiKGV2ZW50KSkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmIChhY3RpdmVJZCkgY2xvc2VTZXNzaW9uKGFjdGl2ZUlkKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmIChzaG9ydGN1dHMuY29weShldmVudCkpIHtcbiAgICAgICAgY29uc3QgYWN0aXZlID0gc2Vzc2lvbnNSZWYuY3VycmVudC5maW5kKChzZXNzaW9uKSA9PiBzZXNzaW9uLmlkID09PSBhY3RpdmVJZClcbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gYWN0aXZlPy50ZXJtLmdldFNlbGVjdGlvbigpXG4gICAgICAgIGlmIChzZWxlY3Rpb24pIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZD8ud3JpdGVUZXh0KHNlbGVjdGlvbilcbiAgICAgICAgfVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmIChzaG9ydGN1dHMucGFzdGUoZXZlbnQpKSB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZSA9IHNlc3Npb25zUmVmLmN1cnJlbnQuZmluZCgoc2Vzc2lvbikgPT4gc2Vzc2lvbi5pZCA9PT0gYWN0aXZlSWQpXG4gICAgICAgIGlmIChhY3RpdmUpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgbmF2aWdhdG9yLmNsaXBib2FyZD8ucmVhZFRleHQoKS50aGVuKCh0ZXh0KSA9PiBhY3RpdmUudGVybS5wYXN0ZSh0ZXh0KSkuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgaWYgKHNob3J0Y3V0cy56b29tSW4oZXZlbnQpIHx8IHNob3J0Y3V0cy56b29tT3V0KGV2ZW50KSB8fCBzaG9ydGN1dHMucmVzZXRab29tKGV2ZW50KSkge1xuICAgICAgICBjb25zdCBhY3RpdmUgPSBzZXNzaW9uc1JlZi5jdXJyZW50LmZpbmQoKHNlc3Npb24pID0+IHNlc3Npb24uaWQgPT09IGFjdGl2ZUlkKVxuICAgICAgICBpZiAoIWFjdGl2ZSkgcmV0dXJuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgaWYgKHNob3J0Y3V0cy56b29tSW4oZXZlbnQpKSBhY3RpdmUudGVybS5vcHRpb25zLmZvbnRTaXplID0gTWF0aC5taW4oMzIsIChhY3RpdmUudGVybS5vcHRpb25zLmZvbnRTaXplID8/IDE0KSArIDEpXG4gICAgICAgIGlmIChzaG9ydGN1dHMuem9vbU91dChldmVudCkpIGFjdGl2ZS50ZXJtLm9wdGlvbnMuZm9udFNpemUgPSBNYXRoLm1heCg4LCAoYWN0aXZlLnRlcm0ub3B0aW9ucy5mb250U2l6ZSA/PyAxNCkgLSAxKVxuICAgICAgICBpZiAoc2hvcnRjdXRzLnJlc2V0Wm9vbShldmVudCkpIGFjdGl2ZS50ZXJtLm9wdGlvbnMuZm9udFNpemUgPSAxNFxuICAgICAgICBhY3RpdmUucmVzaXplKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93bilcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24pXG4gIH0sIFthY3RpdmVJZCwgY2xvc2VTZXNzaW9uLCBuZXdTZXNzaW9uXSlcblxuICBjb25zdCBhY3RpdmUgPSBzZXNzaW9uc1JlZi5jdXJyZW50LmZpbmQoKHNlc3Npb24pID0+IHNlc3Npb24uaWQgPT09IGFjdGl2ZUlkKVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXJtaW5hbC1zaGVsbFwiPlxuICAgICAgPFRhYkJhclxuICAgICAgICBzZXNzaW9ucz17c2Vzc2lvbnNSZWYuY3VycmVudH1cbiAgICAgICAgYWN0aXZlSWQ9e2FjdGl2ZUlkfVxuICAgICAgICBvblNlbGVjdD17c2V0QWN0aXZlSWR9XG4gICAgICAgIG9uQ2xvc2U9e2Nsb3NlU2Vzc2lvbn1cbiAgICAgICAgb25OZXc9e25ld1Nlc3Npb259XG4gICAgICAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXJtaW5hbC1jb250YWluZXJcIiByZWY9e2NvbnRhaW5lclJlZn0gLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGVybWluYWwtc3RhdHVzXCIgYXJpYS1saXZlPVwicG9saXRlXCI+XG4gICAgICAgIHthY3RpdmU/LndzLnJlYWR5U3RhdGUgPT09IFdlYlNvY2tldC5PUEVOID8gJ0Nvbm5lY3RlZCcgOiAnQ29ubmVjdGluZ+KApid9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBUZXJtaW5hbFxuIl0sImZpbGUiOiIvd29ya3NwYWNlcy9Hbm9tZS1UZXJtaW5hbC9mcm9udGVuZC9zcmMvVGVybWluYWwudHN4In0=
