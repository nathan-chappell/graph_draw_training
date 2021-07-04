class HTTPError(Exception):
    status_code = 500
    message = 'internal server error'

    def __repr__(self):
        return f'{self.status_code} {self.message}'

class NotFound(HTTPError):
    status_code = 404
    message = 'not found'
