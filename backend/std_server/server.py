from http.server import HTTPServer, BaseHTTPRequestHandler
import json

def cors(requestHandler):
    requestHandler.send_header('access-control-allow-origin','*')
    requestHandler.send_header('access-control-allow-methods','GET, POST, OPTIONS')
    requestHandler.send_header('access-control-allow-headers','content-type')

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200,'hello world')
        cors(self)
        self.send_header('content-type','application/json')
        self.end_headers()
        x = {'foo': 'bar'}
        data = json.dumps(x)
        self.wfile.write(bytes(data,'ascii'))

    def do_POST(self):
        self.send_response(200,'hello world')
        cors(self)
        self.send_header('content-type','application/json')
        self.end_headers()
        x = {'foo': 'bar'}
        data = json.dumps(x)
        self.wfile.write(bytes(data,'ascii'))

    def do_OPTIONS(self):
        self.send_response(200,'hello world')
        cors(self)
        self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('localhost',8888), RequestHandler)
    server.serve_forever()
