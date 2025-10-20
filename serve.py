import http.server
import socketserver

class UTF8Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        super().end_headers()

if __name__ == '__main__':
    PORT = 8000
    with socketserver.TCPServer(("", PORT), UTF8Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        httpd.serve_forever()
