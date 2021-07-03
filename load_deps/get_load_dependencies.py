from typing import List, DefaultDict, Set, Dict, Iterable

from pathlib import Path
from pprint import pprint

from .dep_graph import Key, Filename


class CycleFoundException(Exception):
    cycle: List[Key]

    def __init__(self, cycle: List[Key]):
        self.cycle = cycle


class OutOfNodes(StopIteration):
    pass


def get_dependency_order(graph: "DepGraph") -> List[Key]:
    UNSEEN = 0
    IN_PATH = 1
    FINISHED = 2

    result: List[Key] = []
    nodes: Dict[Key, "Node"] = graph.V()
    node_keys: List[Key] = [k for k in nodes]
    node_state: Dict[Key, int] = {k: UNSEEN for k in nodes}
    current_path: List[Key] = []

    def new_tree() -> None:
        nonlocal current_path
        while True:
            if len(node_keys) == 0:
                raise OutOfNodes()
            k = node_keys.pop()
            if node_state[k] == UNSEEN:
                current_path = [k]
                node_state[k] = IN_PATH
                break

    def current_node() -> "Node":
        if len(current_path) == 0:
            new_tree()
        return nodes[current_path[-1]]

    def next_child() -> "Node":
        N = current_node().N
        while True:
            if len(N) == 0:
                return None
            _next = N.pop()
            if node_state[_next] == UNSEEN:
                return _next
            elif node_state[_next] == IN_PATH:
                raise CycleFoundException(current_path)
            elif node_state[_next] == FINISHED:
                continue
            else:
                raise RuntimeError("unreachable - invalid state")

    def finish_visit():
        k = current_path.pop()
        node_state[k] = FINISHED
        result.append(k)

    def visit(child: Key):
        current_path.append(child)
        node_state[child] = IN_PATH

    while True:
        try:
            child: Key = next_child()
            if child is None:
                finish_visit()
            else:
                visit(child)
        except OutOfNodes:
            return result


if __name__ == "__main__":
    dep_graph = CppDepGraph()
    # dep_graph.to_dot()
    # pprint(get_dependency_order(dep_graph))
    for dep in get_dependency_order(dep_graph):
        print(dep)
