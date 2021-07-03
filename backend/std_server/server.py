from http.server import HTTPServer, BaseHTTPRequestHandler
import json

from router import Router
from middleware import build_middleware, router_middleware, cors_middleware

class RequestHandler(BaseHTTPRequestHandler):
    def __init__(self, *args):
        super().__init__(*args)

    def do_GET(self):
        self.middleware(self)

    def do_POST(self):
        self.middleware(self)

    def do_OPTIONS(self):
        self.middleware(self)

class MyRequestHandler(RequestHandler):
    router = Router()

    def __init__(self, *args):
        middlewares = [
            router_middleware(self.router),
            cors_middleware,
        ]
        # problematic
        self.router.who_for = self
        self.middleware = build_middleware(middlewares)
        super().__init__(*args)

    @router.get('/')
    def test_get(self, request):
        request.response.data = "<h1> hello world </h1>"

    @router.post('/')
    def test_post(self, request):
        request.response.data = {'hello':'world'}

    @router.options('*')
    def options(self, request):
        ...

if __name__ == '__main__':
    server = HTTPServer(('localhost',8888), MyRequestHandler)
    server.serve_forever()
