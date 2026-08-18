```tsx
"use client";

import { useEffect, useRef } from "react";
import { Terminal as XTerminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

type TerminalProps = {
  wsUrl?: string;
};

export default function Terminal({ wsUrl }: TerminalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const terminal = new XTerminal({
      cursorBlink: true,
      cursorStyle: "block",
      fontFamily: '"Ubuntu Mono", "DejaVu Sans Mono", monospace',
      fontSize: 15,
      lineHeight: 1.2,
      scrollback: 10000,
      convertEol: false,

      theme: {
        background: "#300A24",
        foreground: "#FFFFFF",
        cursor: "#FFFFFF",
        cursorAccent: "#300A24",
        selectionBackground: "#772953",

        black: "#171421",
        red: "#C01C28",
        green: "#26A269",
        yellow: "#A2734C",
        blue: "#12488B",
        magenta: "#A347BA",
        cyan: "#2AA1B3",
        white: "#D0CFCC",

        brightBlack: "#5E5C64",
        brightRed: "#F66151",
        brightGreen: "#33D17A",
        brightYellow: "#E9AD0C",
        brightBlue: "#2A7BDE",
        brightMagenta: "#C061CB",
        brightCyan: "#33C7DE",
        brightWhite: "#FFFFFF",
      },
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.open(containerRef.current);

    try {
      fitAddon.fit();
    } catch {
      // Ignore initial sizing errors.
    }

    terminal.focus();

    const socketUrl =
      wsUrl ??
      `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/ws`;

    const socket = new WebSocket(socketUrl);
    socket.binaryType = "arraybuffer";

    socket.addEventListener("open", () => {
      terminal.writeln(
        "\x1b[1;32mWelcome to Gnome Terminal\x1b[0m"
      );
      terminal.writeln(
        "\x1b[1;37mConnecting to Ubuntu 26.04 LTS...\x1b[0m"
      );

      socket.send(
        JSON.stringify({
          type: "resize",
          cols: terminal.cols,
          rows: terminal.rows,
        })
      );

      socket.send(
        JSON.stringify({
          type: "env",
          key: "TERM",
          value: "xterm-256color",
        })
      );
    });

    socket.addEventListener("message", async (event) => {
      try {
        if (typeof event.data === "string") {
          terminal.write(event.data);
          return;
        }

        if (event.data instanceof ArrayBuffer) {
          const text = new TextDecoder().decode(
            new Uint8Array(event.data)
          );

          terminal.write(text);
          return;
        }

        if (event.data instanceof Blob) {
          const buffer = await event.data.arrayBuffer();

          terminal.write(
            new TextDecoder().decode(new Uint8Array(buffer))
          );
        }
      } catch (error) {
        console.error("Terminal output error:", error);
      }
    });

    socket.addEventListener("error", () => {
      terminal.writeln(
        "\r\n\x1b[1;31mWebSocket connection failed.\x1b[0m"
      );
    });

    socket.addEventListener("close", () => {
      terminal.writeln(
        "\r\n\x1b[1;33mTerminal connection closed.\x1b[0m"
      );
    });

    const dataDisposable = terminal.onData((data) => {
      if (socket.readyState !== WebSocket.OPEN) {
        return;
      }

      const bytes = new TextEncoder().encode(data);

      socket.send(bytes.buffer);
    });

    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch {
        return;
      }

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "resize",
            cols: terminal.cols,
            rows: terminal.rows,
          })
        );
      }
    });

    resizeObserver.observe(containerRef.current);

    const handleWindowResize = () => {
      try {
        fitAddon.fit();
      } catch {
        return;
      }

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "resize",
            cols: terminal.cols,
            rows: terminal.rows,
          })
        );
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);

      resizeObserver.disconnect();
      dataDisposable.dispose();

      try {
        socket.close();
      } catch {
        // Ignore socket cleanup errors.
      }

      terminal.dispose();
    };
  }, [wsUrl]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "500px",
        background: "#300A24",
        overflow: "hidden",
      }}
    />
  );
}
```
