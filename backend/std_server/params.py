from pprint import pformat

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


