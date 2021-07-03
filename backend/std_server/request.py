from pprint import pformat
import json

from params import Params

class Response:
    def __init__(self):
        self.data = None
        self.headers = {}
        self.status_code = 200
        self.message = 'Ok'

class Request:
    """Input to functions will be converted to a Request"""
    def __init__(self, requestHandler, param_dict = {}):
        self.params = Params(param_dict)
        self.path = requestHandler.path
        self.method = requestHandler.command
        self.headers = requestHandler.headers
        self.read_data(requestHandler)
        self.requestHandler = requestHandler
        self.response = Response()

    def read_data(self, requestHandler):
        try:
            length = requestHandler.headers['content-length']
            if requestHandler.headers['content-type'] == 'application/json':
                data = requestHandler.rfile.read(int(length))
                self.data = json.loads(data)
            else:
                raise Exception()
        except Exception as e:
            print(e)
            self.data = None

    def __repr__(self):
        return f'''
Request:
{self.method} {self.path}
headers:
{dict(self.headers)}
{self.params}
Data:
{self.data}
'''


