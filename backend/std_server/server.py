from http.server import HTTPServer

from server_base import RequestHandler
from router import Router
from middleware import build_middleware, router_middleware, cors_middleware, logging_middleware
from errors import error_middleware, NotFound

from graph_db import GraphDB

db = GraphDB()

def convert_keyerror_to_notfound(_next):
    def handler(request):
        try:
            _next(request)
        except KeyError:
            raise NotFound()
    return handler


class MiddlewareRequestHandler(RequestHandler):
    router = Router()

    def __init__(self, *args):
        middlewares = [
            logging_middleware,
            error_middleware,
            convert_keyerror_to_notfound,
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
        pass

    @router.post('/create')
    def create(self, request):
        db.create(request.data)

    @router.get('/{id}')
    def read(self, request):
        if request.params.id == '_all':
            request.response.data = db.data
        else:
            request.response.data = db.read(request.params.id)

    @router.post('/update/{id}')
    def update(self, request):
        db.update(request.params.id, request.data)

    @router.delete('/{id}')
    def delete(self, request):
        db.delete(request.params.id)

if __name__ == '__main__':
    server = HTTPServer(('localhost',8888), MiddlewareRequestHandler)
    server.serve_forever()
