import re

from typing import Iterable
from pathlib import Path

from .dep_graph import DepGraph, Filename, Key

class JsDepGraph(DepGraph):
    suffixes = [".js"]
    dep_re = re.compile(r"// depends ((?:\w|[/.-])*.js)")

    def __init__(self, *args, **kwargs):
        super().__init__(**kwargs)

    def get_deps(self, filename: Filename) -> Iterable[Filename]:
        directory = Path(filename).parent
        with open(filename) as f:
            dep_matches = [self.dep_re.match(l) for l in f]
            dep_paths = [directory / m.group(1) for m in dep_matches if m is not None]
            for path in dep_paths:
                if not path.exists():
                    print(f'{path} does not exist!')
            return [str(path.resolve()) for path in dep_paths]
