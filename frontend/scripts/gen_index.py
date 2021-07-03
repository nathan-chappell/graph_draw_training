from pprint import pprint
from pathlib import Path

import jinja2

import sys
sys.path.append('../../')

from load_deps import JsDepGraph, get_dependency_order

index = Path('../js/index.js')
depGraph = JsDepGraph(root_dir='../js')
depGraph.to_dot()
dep_order = get_dependency_order(depGraph)
pprint(dep_order)
deps = [str(Path(p).relative_to(Path('..').resolve())) + '.js' for p in dep_order]

template_contents = None
with open('templates/index.html') as f:
    template_contents = f.read()
template = jinja2.Template(template_contents)

rendered = template.render(deps=deps)
print(rendered)
