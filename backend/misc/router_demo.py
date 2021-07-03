from pprint import pprint

class Request:
    data = None

    def __repr__(self):
        return f'(Request: {self.data})'

class Response:
    result = None

    def __repr__(self):
        return f'(Response: {self.result})'

class Router:
    def __init__(self):
        self.routes = {}

    def wrap_result(self, result):
        r = Response()
        r.result = result
        return r

    def wrap_request(self, *args):
        r = Request()
        r.data = args[0]
        return r

    def route(self, where):
        def wrapper(what):
            def wrapped(other_self, *args, **kwargs):
                r = self.wrap_request(*args)
                print('wrapped -', where, r)
                result = what(other_self, r)
                return self.wrap_result(result)
            self.routes[where] = wrapped
            return wrapped
        return wrapper

class X:
    router = Router()

    @router.route('here')
    def f(self, request):
        return request.data * 3

    @router.route('there')
    def g(self, request):
        return request.data + 7
    
    def __call__(self, where, *args):
        return self.router.routes[where](self, *args)

x = X()
print(x('here',8))
print(x('there',8))
