from request import Request

def cors(requestHandler):
    requestHandler.send_header('access-control-allow-origin','*')
    requestHandler.send_header('access-control-allow-methods','GET, POST, OPTIONS')
    requestHandler.send_header('access-control-allow-headers','content-type')

def nop(x): ...

def last_op(_next):
    def handler(request):
        requestHandler = request.requestHandler
        response = _next(request)
        data = None
        requestHandler.send_response(request.status_code, request.message)
        for k,v in response.headers:
            requestHandler.send_header(k,v)
        if response.data is not None:
            data = bytes(JSON.dumps(response.data))
            requestHandler.send_header('content-type','application/json')
            requestHandler.send_header('content-length',str(len(data)))
        requestHandler.end_headers()
        if data is not None:
            requestHandler.wfile.write(data)

def build_middleware(middlewares):
    middleware = nop
    for _prev in reversed(middlewares):
        middleware = _prev(middleware)
    return last_op(middleware)

# must always be first!
def router_middleware(router):
    def apply_middleware(_next):
        def handler(request)
            response = router.call_route(request.path, request)
            return response
        return handler
    return apply_middleware

def cors_middleware(_next):
    def handler(request):
        request.response.headers['access-control-allow-origin','*']
        request.response.headers['access-control-allow-methods','GET, POST, OPTIONS']
        request.response.headers['access-control-allow-headers','content-type']
