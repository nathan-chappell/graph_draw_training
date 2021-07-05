import sys
from itertools import chain, product
from collections import defaultdict
from pathlib import Path
from typing import List, DefaultDict, Set, Dict, Iterable, Union

Filename = str
Key = str

def remove_suffix(s, suffix):
    if s.find(suffix) == -1:
        return
    return s[:s.find(suffix)]

class Node:
    graph: "DepGraph" = None
    key: Key = None
    N: Set[Key]

    def __init__(self, graph, key):
        self.graph = graph
        self.key = key
        self.N = set(graph.file_deps[key])


class DepGraph:
    suffixes: List[str] = []
    file_deps: DefaultDict[Key, Set[Key]]
    root_dir: Union[str,Path]

    def __init__(self, *, root_dir='./src', build_on_init=True):
        self.file_deps = defaultdict(set)
        self.root_dir = root_dir
        if build_on_init:
            self.build()

    # build helpers

    def get_all_src(self) -> Set[Filename]:
        p = Path(self.root_dir)
        return set(
            [
                str(f.resolve())
                for f in chain(*[p.glob(f"**/*{s}") for s in self.suffixes])
            ]
        )

    def get_key(self, filename: Filename) -> Key:
        for suffix in self.suffixes:
            # filename = filename.removesuffix(suffix)
            filename = remove_suffix(filename, suffix)
        return filename

    def get_deps(self, filename: Filename) -> List[Filename]:
        raise NotImplemented

    def build(self) -> None:
        filenames = self.get_all_src()
        for filename in filenames:
            self.add_edges(filename, self.get_deps(filename))
        # print('file_deps')
        # pprint(self.file_deps)
        self.prune_graph()

    def prune_graph(self):
        pass

    # graph ops

    def add_edges(self, tail: Filename, heads: Iterable[Filename]) -> None:
        key = self.get_key(tail)
        for head in heads:
            if self.get_key(head) == key:
                continue
            self.file_deps[key].add(self.get_key(head))

    def remove_vertex(self, k: str) -> None:
        key = self.get_key(k)
        for children in self.file_deps.values():
            if key in children:
                children.remove(key)
        if key in self.file_deps:
            del self.file_deps[key]

    def V(self) -> Dict[Key, Node]:
        keys = [tails for tails in self.file_deps]
        heads = [head for v in self.file_deps.values() for head in v]
        keys.extend(heads)
        return {k: Node(self, k) for k in keys}

    def contract(self, k: str) -> None:
        key = self.get_key(k)
        children = self.file_deps[key]
        parents = [p for p in self.file_deps if key in self.file_deps[p]]
        for p in parents:
            self.add_edges(p, children)
        self.remove_vertex(key)

    # output

    def to_dot(self, file=sys.stdout) -> str:
        print("digraph {")
        for t in self.file_deps:
            print(f"\t{t}")
            for h in self.file_deps[t]:
                print(f"\t{t} -> {h}")
        print("}")
