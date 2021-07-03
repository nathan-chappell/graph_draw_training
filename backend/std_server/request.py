from pprint import pformat
import json

class Params:
    def __init__(self, param_dict):
        self.param_dict = param_dict

    def add_params(self, param_dict):
        for k,v in param_dict.items():
            self.param_dict[k] = v

    def __getattr__(self, key):
        try:
            return self.param_dict[key]
        except KeyError:
            return None

    def __repr__(self):
        return "Params:\n" + pformat(self.param_dict)

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


