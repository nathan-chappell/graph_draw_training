import re
from typing import Iterable
from pathlib import Path

from .dep_graph import DepGraph, Filename, Key

class CppDepGraph(DepGraph):
    suffixes = [".cpp", ".h"]
    dep_re = re.compile(r'#include "([^"]*).h"')

    def __init__(self):
        super().__init__(self)

    def get_deps(self, filename: Filename) -> Iterable[Filename]:
        directory = Path(filename).parent
        with open(filename) as f:
            dep_matches = [self.dep_re.match(l) for l in f]
            dep_paths = [directory / m.group(1) for m in dep_matches if m is not None]
            return [str(path.resolve()) for path in dep_paths]

    def prune_graph(self):
        filenames = self.get_all_src()

        def has_object(f: str) -> bool:
            src_suffix = [".c", ".cpp"]
            return any([f.replace(".h", s) in filenames for s in src_suffix])

        to_contract = [f for f in filenames if f.endswith(".h") and not has_object(f)]
        for n in to_contract:
            self.contract(n)
