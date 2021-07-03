from pprint import pprint
import re

class Request:
    """Input to functions will be converted to a Request"""
    data = None

    def __repr__(self):
        return f'(Request: {self.data})'

class Response:
    """Output of functions will be converted to a Response"""
    result = None

    def __repr__(self):
        return f'(Response: {self.result})'

class Params:
    def __init__(self, param_dict):
        self.param_dict = param_dict

    def __getattr__(self, key):
        try:
            return self.param_dict[key]
        except KeyError:
            return None

class Router:
    """Determine which function to call by name provided
    also, input to functions is wrapped in Request,
    also, output of functions is wrapper in Response
    """

    def __init__(self):
        self.routes = {}

    def wrap_result(self, result):
        r = Response()
        r.result = result
        return r

    def route(self, where):
        def wrapper(what):
            def wrapped(other_self, request):
                print('wrapped -', where, request)
                result = what(other_self, request)
                return self.wrap_result(result)
            self.routes[where] = wrapped
            return wrapped
        return wrapper

    def match_route(self, where):
        for name,fn in self.routes.items():
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
                
    def call_route(self, other_self, where):
        f, params = self.match_route(where)
        request = Request()
        request.params = Params(params)
        return f(other_self, request)

class X:
    router = Router()

    @router.route('here')
    def f(self, request):
        return 'f'

    @router.route('there')
    def g(self, request):
        return 'g'

    @router.route('add/{x}/{y}')
    def h(self, request):
        return int(request.params.x) + int(request.params.y)
    
    def __call__(self, where):
        return self.router.call_route(self, where)

x = X()
print(x('here'))
print(x('there'))
print(x('add/13/4'))
