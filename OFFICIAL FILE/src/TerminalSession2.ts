import __vite__cjsImport0__xterm_xterm from "/node_modules/.vite/deps/@xterm_xterm.js?v=c3e14a67";
const XTerm = __vite__cjsImport0__xterm_xterm["Terminal"];
import __vite__cjsImport1__xterm_addonFit from "/node_modules/.vite/deps/@xterm_addon-fit.js?v=c3e14a67";
const FitAddon = __vite__cjsImport1__xterm_addonFit["FitAddon"];
import __vite__cjsImport2__xterm_addonWebLinks from "/node_modules/.vite/deps/@xterm_addon-web-links.js?v=c3e14a67";
const WebLinksAddon = __vite__cjsImport2__xterm_addonWebLinks["WebLinksAddon"];
import {ubuntuTheme, terminalFont} from "/src/theme.ts";
export class TerminalSession {
    constructor(id, url) {
        this.title = "Terminal";
        this.id = id;
        this.term = new XTerm({
            cursorBlink: true,
            cursorStyle: "block",
            fontFamily: terminalFont,
            fontSize: 14,
            lineHeight: 1.15,
            scrollback: 1e4,
            convertEol: false,
            allowTransparency: false,
            theme: ubuntuTheme,
            rightClickSelectsWord: true,
            scrollOnOutput: false,
            fastScrollModifier: "alt"
        });
        this.fit = new FitAddon();
        this.term.loadAddon(this.fit);
        this.term.loadAddon(new WebLinksAddon());
        this.ws = new WebSocket(url);
        this.ws.binaryType = "arraybuffer";
    }
    connect(onClose) {
        this.ws.addEventListener("open", () => {
            this.sendJson({
                type: "resize",
                cols: this.term.cols,
                rows: this.term.rows
            });
        }
        );
        this.ws.addEventListener("message", (event) => {
            if (typeof event.data === "string") {
                this.term.write(event.data);
            } else {
                this.term.write(new TextDecoder().decode(new Uint8Array(event.data)));
            }
        }
        );
        this.ws.addEventListener("close", onClose);
        this.term.onData( (data) => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(new TextEncoder().encode(data).buffer);
            }
        }
        );
    }
    resize() {
        if (!this.term.element)
            return;
        this.fit.fit();
        this.sendJson({
            type: "resize",
            cols: this.term.cols,
            rows: this.term.rows
        });
    }
    sendJson(value) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(value));
        }
    }
    dispose() {
        this.ws.close();
        this.term.dispose();
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRlcm1pbmFsU2Vzc2lvbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZXJtaW5hbCBhcyBYVGVybSB9IGZyb20gJ0B4dGVybS94dGVybSdcbmltcG9ydCB7IEZpdEFkZG9uIH0gZnJvbSAnQHh0ZXJtL2FkZG9uLWZpdCdcbmltcG9ydCB7IFdlYkxpbmtzQWRkb24gfSBmcm9tICdAeHRlcm0vYWRkb24td2ViLWxpbmtzJ1xuaW1wb3J0IHsgdWJ1bnR1VGhlbWUsIHRlcm1pbmFsRm9udCB9IGZyb20gJy4vdGhlbWUnXG5cbmV4cG9ydCBjbGFzcyBUZXJtaW5hbFNlc3Npb24ge1xuICByZWFkb25seSBpZDogbnVtYmVyXG4gIHJlYWRvbmx5IHRlcm06IFhUZXJtXG4gIHJlYWRvbmx5IGZpdDogRml0QWRkb25cbiAgcmVhZG9ubHkgd3M6IFdlYlNvY2tldFxuICB0aXRsZSA9ICdUZXJtaW5hbCdcblxuICBjb25zdHJ1Y3RvcihpZDogbnVtYmVyLCB1cmw6IHN0cmluZykge1xuICAgIHRoaXMuaWQgPSBpZFxuICAgIHRoaXMudGVybSA9IG5ldyBYVGVybSh7XG4gICAgICBjdXJzb3JCbGluazogdHJ1ZSxcbiAgICAgIGN1cnNvclN0eWxlOiAnYmxvY2snLFxuICAgICAgZm9udEZhbWlseTogdGVybWluYWxGb250LFxuICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgbGluZUhlaWdodDogMS4xNSxcbiAgICAgIHNjcm9sbGJhY2s6IDEwMDAwLFxuICAgICAgY29udmVydEVvbDogZmFsc2UsXG4gICAgICBhbGxvd1RyYW5zcGFyZW5jeTogZmFsc2UsXG4gICAgICB0aGVtZTogdWJ1bnR1VGhlbWUsXG4gICAgICByaWdodENsaWNrU2VsZWN0c1dvcmQ6IHRydWUsXG4gICAgICBzY3JvbGxPbk91dHB1dDogZmFsc2UsXG4gICAgICBmYXN0U2Nyb2xsTW9kaWZpZXI6ICdhbHQnLFxuICAgIH0pXG4gICAgdGhpcy5maXQgPSBuZXcgRml0QWRkb24oKVxuICAgIHRoaXMudGVybS5sb2FkQWRkb24odGhpcy5maXQpXG4gICAgdGhpcy50ZXJtLmxvYWRBZGRvbihuZXcgV2ViTGlua3NBZGRvbigpKVxuICAgIHRoaXMud3MgPSBuZXcgV2ViU29ja2V0KHVybClcbiAgICB0aGlzLndzLmJpbmFyeVR5cGUgPSAnYXJyYXlidWZmZXInXG4gIH1cblxuICBjb25uZWN0KG9uQ2xvc2U6ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoJ29wZW4nLCAoKSA9PiB7XG4gICAgICB0aGlzLnNlbmRKc29uKHsgdHlwZTogJ3Jlc2l6ZScsIGNvbHM6IHRoaXMudGVybS5jb2xzLCByb3dzOiB0aGlzLnRlcm0ucm93cyB9KVxuICAgIH0pXG4gICAgdGhpcy53cy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGV2ZW50LmRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMudGVybS53cml0ZShldmVudC5kYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50ZXJtLndyaXRlKG5ldyBUZXh0RGVjb2RlcigpLmRlY29kZShuZXcgVWludDhBcnJheShldmVudC5kYXRhIGFzIEFycmF5QnVmZmVyKSkpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLndzLmFkZEV2ZW50TGlzdGVuZXIoJ2Nsb3NlJywgb25DbG9zZSlcbiAgICB0aGlzLnRlcm0ub25EYXRhKChkYXRhKSA9PiB7XG4gICAgICBpZiAodGhpcy53cy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgICB0aGlzLndzLnNlbmQobmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKGRhdGEpLmJ1ZmZlcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmVzaXplKCkge1xuICAgIGlmICghdGhpcy50ZXJtLmVsZW1lbnQpIHJldHVyblxuICAgIHRoaXMuZml0LmZpdCgpXG4gICAgdGhpcy5zZW5kSnNvbih7IHR5cGU6ICdyZXNpemUnLCBjb2xzOiB0aGlzLnRlcm0uY29scywgcm93czogdGhpcy50ZXJtLnJvd3MgfSlcbiAgfVxuXG4gIHNlbmRKc29uKHZhbHVlOiBvYmplY3QpIHtcbiAgICBpZiAodGhpcy53cy5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xuICAgICAgdGhpcy53cy5zZW5kKEpTT04uc3RyaW5naWZ5KHZhbHVlKSlcbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMud3MuY2xvc2UoKVxuICAgIHRoaXMudGVybS5kaXNwb3NlKClcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiQUFBQSxTQUFTLFlBQVksYUFBYTtBQUNsQyxTQUFTLGdCQUFnQjtBQUN6QixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGFBQWEsb0JBQW9CO0FBRW5DLGFBQU0sZ0JBQWdCO0FBQUEsRUFPM0IsWUFBWSxJQUFZLEtBQWE7QUFGckMsaUJBQVE7QUFHTixTQUFLLEtBQUs7QUFDVixTQUFLLE9BQU8sSUFBSSxNQUFNO0FBQUEsTUFDcEIsYUFBYTtBQUFBLE1BQ2IsYUFBYTtBQUFBLE1BQ2IsWUFBWTtBQUFBLE1BQ1osVUFBVTtBQUFBLE1BQ1YsWUFBWTtBQUFBLE1BQ1osWUFBWTtBQUFBLE1BQ1osWUFBWTtBQUFBLE1BQ1osbUJBQW1CO0FBQUEsTUFDbkIsT0FBTztBQUFBLE1BQ1AsdUJBQXVCO0FBQUEsTUFDdkIsZ0JBQWdCO0FBQUEsTUFDaEIsb0JBQW9CO0FBQUEsSUFDdEIsQ0FBQztBQUNELFNBQUssTUFBTSxJQUFJLFNBQVM7QUFDeEIsU0FBSyxLQUFLLFVBQVUsS0FBSyxHQUFHO0FBQzVCLFNBQUssS0FBSyxVQUFVLElBQUksY0FBYyxDQUFDO0FBQ3ZDLFNBQUssS0FBSyxJQUFJLFVBQVUsR0FBRztBQUMzQixTQUFLLEdBQUcsYUFBYTtBQUFBLEVBQ3ZCO0FBQUEsRUFFQSxRQUFRLFNBQXFCO0FBQzNCLFNBQUssR0FBRyxpQkFBaUIsUUFBUSxNQUFNO0FBQ3JDLFdBQUssU0FBUyxFQUFFLE1BQU0sVUFBVSxNQUFNLEtBQUssS0FBSyxNQUFNLE1BQU0sS0FBSyxLQUFLLEtBQUssQ0FBQztBQUFBLElBQzlFLENBQUM7QUFDRCxTQUFLLEdBQUcsaUJBQWlCLFdBQVcsQ0FBQyxVQUFVO0FBQzdDLFVBQUksT0FBTyxNQUFNLFNBQVMsVUFBVTtBQUNsQyxhQUFLLEtBQUssTUFBTSxNQUFNLElBQUk7QUFBQSxNQUM1QixPQUFPO0FBQ0wsYUFBSyxLQUFLLE1BQU0sSUFBSSxZQUFZLEVBQUUsT0FBTyxJQUFJLFdBQVcsTUFBTSxJQUFtQixDQUFDLENBQUM7QUFBQSxNQUNyRjtBQUFBLElBQ0YsQ0FBQztBQUNELFNBQUssR0FBRyxpQkFBaUIsU0FBUyxPQUFPO0FBQ3pDLFNBQUssS0FBSyxPQUFPLENBQUMsU0FBUztBQUN6QixVQUFJLEtBQUssR0FBRyxlQUFlLFVBQVUsTUFBTTtBQUN6QyxhQUFLLEdBQUcsS0FBSyxJQUFJLFlBQVksRUFBRSxPQUFPLElBQUksRUFBRSxNQUFNO0FBQUEsTUFDcEQ7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxTQUFTO0FBQ1AsUUFBSSxDQUFDLEtBQUssS0FBSyxRQUFTO0FBQ3hCLFNBQUssSUFBSSxJQUFJO0FBQ2IsU0FBSyxTQUFTLEVBQUUsTUFBTSxVQUFVLE1BQU0sS0FBSyxLQUFLLE1BQU0sTUFBTSxLQUFLLEtBQUssS0FBSyxDQUFDO0FBQUEsRUFDOUU7QUFBQSxFQUVBLFNBQVMsT0FBZTtBQUN0QixRQUFJLEtBQUssR0FBRyxlQUFlLFVBQVUsTUFBTTtBQUN6QyxXQUFLLEdBQUcsS0FBSyxLQUFLLFVBQVUsS0FBSyxDQUFDO0FBQUEsSUFDcEM7QUFBQSxFQUNGO0FBQUEsRUFFQSxVQUFVO0FBQ1IsU0FBSyxHQUFHLE1BQU07QUFDZCxTQUFLLEtBQUssUUFBUTtBQUFBLEVBQ3BCO0FBQ0Y7IiwibmFtZXMiOltdfQ==
