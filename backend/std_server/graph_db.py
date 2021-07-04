"""KISS in-memory db for storing our graphs"""

from collections import defaultdict

def new_id():
    new_id.id += 1
    return new_id.id

setattr(new_id,'id',0)

class GraphDB:
    def __init__(self):
        self.data = defaultdict(lambda : defaultdict(list))

    def create(self, graph):
        self.data[new_id()] = graph

    def read(self, _id):
        return self.data[_id]

    def update(self, _id, graph):
        self.data[_id] = graph

    def delete(self, _id):
        del self[_id]
