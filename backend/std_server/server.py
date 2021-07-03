from http.server import HTTPServer, BaseHTTPRequestHandler
import json

class Params:
    def __init__(self, param_dict):
        self.param_dict = param_dict

    def add_params(self, param_dict):
        for k,v in param_dict.items():
            self.param_dict[k] = v

    def __getattr__(self, key):
        try:
            return self.param_dict[key]
        except KeyError:
            return None

class Request:
    """Input to functions will be converted to a Request"""
    def __init__(self, requestHandler):
        self.params = Params()
        self.path = requestHandler.path
        self.method = requestHandler.command
        self.headers = requestHandler.headers
        self.read_data(requestHandler)

    def read_data(self, requestHandler):
        if 'content-type' in requestHandler:
            ...

    def __repr__(self):
        return f'(Request: {self.data})'

class Response:
    """Output of functions will be converted to a Response"""
    result = None

    def __repr__(self):
        return f'(Response: {self.result})'


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
        breakpoint()
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
