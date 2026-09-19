import http.server
import socketserver
import json
import os
import re

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class TimetableHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_POST(self):
        if self.path == '/api/save':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                timetable_file = os.path.join(DIRECTORY, 'js', 'timetable-data.js')
                with open(timetable_file, 'r', encoding='utf-8') as f:
                    content = f.read()

                formatted_json = json.dumps(data, ensure_ascii=False, indent=2)
                new_content = re.sub(
                    r'const DEFAULT_TIMETABLE_DATA = \{[\s\S]+?\n\};',
                    f'const DEFAULT_TIMETABLE_DATA = {formatted_json};',
                    content
                )
                with open(timetable_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(b'{"status": "success", "message": "saved directly to disk"}')
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

import sys
sys.stdout.reconfigure(encoding='utf-8')

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), TimetableHandler) as httpd:
        print(f"Server running on http://localhost:{PORT}")
        httpd.serve_forever()
