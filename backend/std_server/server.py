from http.server import HTTPServer

from server_base import RequestHandler
from router import Router
from middleware import build_middleware, router_middleware, cors_middleware, logging_middleware
from errors import error_middleware

class MiddlewareRequestHandler(RequestHandler):
    router = Router()

    def __init__(self, *args):
        middlewares = [
            logging_middleware,
            error_middleware,
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
    server = HTTPServer(('localhost',8888), MiddlewareRequestHandler)
    server.serve_forever()
