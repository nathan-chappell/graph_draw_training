import re

from params import Params
from errors import NotFound

class Router:
    def __init__(self, who_for = None):
        self.routes = {
            'GET': {},
            'POST': {},
            'OPTIONS': {},
        }
        self.who_for = who_for

    def route(self, method, route):
        def wrapper(fn):
            self.routes[method][route] = fn
            return fn
        return wrapper

    def get(self, route):
        return self.route('GET',route)

    def post(self, route):
        return self.route('POST',route)

    def options(self, route):
        return self.route('OPTIONS',route)

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
        raise NotFound()

    def call_route(self, request):
        route = re.sub(r'\?.*', '', request.path)
        f, param_dict = self.match_route(route, request.method.upper())
        request.params = Params(param_dict)
        return f(self.who_for, request)
