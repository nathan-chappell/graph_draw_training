from pprint import pprint
from pathlib import Path

import jinja2

load_deps_dir = '../../'

import sys
sys.path.append(load_deps_dir)

from load_deps import JsDepGraph, get_dependency_order

index_path = '../js/index.js'
root_dir = '../js'

index = Path(index_path)
depGraph = JsDepGraph(root_dir=root_dir)
depGraph.to_dot()
dep_order = get_dependency_order(depGraph)
pprint(dep_order)
deps = [str(Path(p).relative_to(Path('..').resolve())) + '.js' for p in dep_order]

template_dir = 'templates'
index_template_file = 'index.html'

template_contents = None
with open(f'{template_dir}/{index_template_file}') as f:
    template_contents = f.read()
template = jinja2.Template(template_contents)

rendered = template.render(deps=deps)
print(rendered)
