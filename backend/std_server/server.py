from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200,'hello world')
        self.send_header('access-control-allow-origin','*')
        self.send_header('content-type','application/json')
        self.end_headers()
        x = {'foo': 'bar'}
        data = json.dumps(x)
        self.wfile.write(bytes(data,'ascii'))

if __name__ == '__main__':
    server = HTTPServer(('localhost',8888), RequestHandler)
    server.serve_forever()
