from http.server import HTTPServer, BaseHTTPRequestHandler

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200,'hello world')
        self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost',8888), RequestHandler)
    server.serve_forever()
