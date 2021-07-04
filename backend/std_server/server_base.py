from http.server import BaseHTTPRequestHandler

class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args):
        super().__init__(*args)

    def do_GET(self):
        self.middleware(self)

    def do_POST(self):
        self.middleware(self)

    def do_OPTIONS(self):
        self.middleware(self)
