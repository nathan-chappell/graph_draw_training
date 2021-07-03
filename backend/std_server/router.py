from http.server import HTTPServer, BaseHTTPRequestHandler
import json

from request import Request
from middlewares import build_middleware

class Router:
    def __init__(self, who_for):
        self.routes = {
            'GET': {},
            'POST': {},
            'OPTIONS': {},
        }
        self.who_for = who_for

    def route(self, where):
        def wrapper(what):
            self.routes[where] = what
            return wrapped
        return wrapper

    def match_route(self, where, method):
        routes = self.routes[method]
        for name,fn in routes.items():
            # catch-all
            if name == '*':
                return fn, None
            # simple case
            is_regex = re.search('{', name) is not None
            if not is_regex and where == name:
                return fn, None
            elif is_regex:
                regex = re.sub(r'{(\w*)}',r'(?P<\1>[a-zA-Z0-9_-]*)', name)
                m = re.match(regex, where)
                if m is None:
                    continue
                return fn, m.groupdict()

    def call_route(self, request):
        f, param_dict = self.match_route(request.path, request.method.upper())
        request.params = Params(param_dict)
        return f(self.who_for, request)

class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, middlewares):
        self.middleware = build_middleware(middlewares)

    def do_GET(self):
        route = self.path
        result = self.get_router.call_route(route)
        self.send_response(200,'hello world')
        cors(self)
        self.send_header('content-type','application/json')
        self.end_headers()
        x = {'foo': 'bar'}
        data = json.dumps(x)
        self.wfile.write(bytes(data,'ascii'))

    def do_POST(self):
        r = Request(self)
        print(r)
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

class MyServer:
    getRouter = Router()
    postRouter = Router()

    def __init__(self, middlewares):
        super().__init__(self, middlewares)
