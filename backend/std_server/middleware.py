import json

from request import Request

def nop(x): ...

def first_op(_next):
    """Essentially the "framework" middleware"""
    def handler(requestHandler):
        # requestHandler = request.requestHandler
        request = Request(requestHandler)
        _next(request)
        response = request.response
        data = None
        requestHandler.send_response(response.status_code, response.message)
        for k,v in response.headers.items():
            requestHandler.send_header(k,v)
        if response.data is not None:
            if type(response.data) == str:
                data = bytes(response.data, 'ascii')
                requestHandler.send_header('content-type','text/html')
            else:
                data = bytes(json.dumps(response.data), 'ascii')
                requestHandler.send_header('content-type','application/json')
        requestHandler.end_headers()
        if data is not None:
            requestHandler.send_header('content-length',str(len(data)))
            requestHandler.wfile.write(data)
    return handler

def build_middleware(middlewares):
    middleware = nop
    for _prev in reversed(middlewares):
        middleware = _prev(middleware)
    return first_op(middleware)

# must always be first!
def router_middleware(router):
    def apply_middleware(_next):
        def handler(request):
            router.call_route(request)
            _next(request)
        return handler
    return apply_middleware

def cors_middleware(_next):
    def handler(request):
        request.response.headers['access-control-allow-origin'] = '*'
        request.response.headers['access-control-allow-methods'] = 'GET, POST, OPTIONS, DELETE'
        request.response.headers['access-control-allow-headers'] = 'content-type'
    return handler

def logging_middleware(_next):
    def handler(request):
        print(request)
        _next(request)
    return handler
