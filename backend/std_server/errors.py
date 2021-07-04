class HTTPError(Exception):
    status_code = 500
    message = 'internal server error'

    def __repr__(self):
        return f'{self.status_code} {self.message}'

class NotFound(HTTPError):
    status_code = 404
    message = 'not found'

def error_middleware(_next):
    def handle_error(request, error):
        if isinstance(error, HTTPError):
            request.response.status_code = error.status_code
            request.response.message = error.message
        else:
            request.response.status_code = 500
            request.response.message = b'unhandled internal server error'
    def handler(request):
        error = None
        try:
            _next(request)
        except NotFound as e:
            request.response.data = '''<h1>Sorry, we couldn't find that page</h1>'''
            error = e
        except HTTPError as e:
            request.response.data = '''<h1>Sorry, we couldn't find that page</h1>'''
            error = e
        finally:
            if error is not None:
                handle_error(request, error)
    return handler
