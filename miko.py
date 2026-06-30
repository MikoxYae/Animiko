#!/usr/bin/env python3
import http.server
import socketserver
import socket
import urllib.request
from pathlib import Path

HOST = "0.0.0.0"
PORT = 7777
BASE_DIR = Path(__file__).resolve().parent
WEB_DIR = BASE_DIR / "web"

class AniMikoHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_DIR), **kwargs)

    def do_GET(self):
        path = self.path.split('?', 1)[0]
        if path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'OK')
            return
        requested = WEB_DIR / path.lstrip('/')
        if path != '/' and not requested.exists() and not path.startswith('/assets'):
            self.path = '/index.html'
        return super().do_GET()

    def log_message(self, fmt, *args):
        print(f"[AniMiko] {self.address_string()} - {fmt % args}", flush=True)

def public_ip():
    for url in ("https://api.ipify.org", "https://icanhazip.com", "https://ifconfig.me/ip"):
        try:
            with urllib.request.urlopen(url, timeout=4) as r:
                ip = r.read().decode().strip()
                if ip:
                    return ip
        except Exception:
            pass
    try:
        return socket.gethostbyname(socket.gethostname())
    except Exception:
        return "YOUR_VPS_IP"

if __name__ == "__main__":
    if not WEB_DIR.exists():
        raise SystemExit("web folder not found")
    with socketserver.ThreadingTCPServer((HOST, PORT), AniMikoHandler) as httpd:
        httpd.allow_reuse_address = True
        ip = public_ip()
        print("[AniMiko] Python server started", flush=True)
        print(f"[AniMiko] Local URL: http://127.0.0.1:{PORT}", flush=True)
        print(f"[AniMiko] VPS URL:   http://{ip}:{PORT}", flush=True)
        print("[AniMiko] Stop server with Ctrl+C", flush=True)
        httpd.serve_forever()
