from pprint import pprint
from pathlib import Path

import jinja2

load_deps_dir = '../../'

import sys
sys.path.append(load_deps_dir)

from load_deps import JsDepGraph, get_dependency_order

debug = False

def parse_args():
    global debug
    if len(sys.argv) > 1 and sys.argv[1] == '-v':
        debug = True

def get_deps(index_path, root_dir):
    index = Path(index_path)
    depGraph = JsDepGraph(root_dir=root_dir)
    dep_order = get_dependency_order(depGraph)
    if debug:
        depGraph.to_dot()
        pprint(dep_order)
    deps = [str(Path(p).relative_to(Path('..').resolve())) + '.js' for p in dep_order]
    return deps

def get_rendered_template(template_dir, template_file, template_args):
    template_contents = None
    with open(f'{template_dir}/{template_file}') as f:
        template_contents = f.read()
    template = jinja2.Template(template_contents)
    rendered = template.render(**template_args)
    if debug:
        print(rendered)
    return rendered

if __name__ == '__main__':
    parse_args()

    index_path = '../js/index.js'
    root_dir = '../js'
    deps = get_deps(index_path, root_dir)

    template_dir = 'templates'
    index_template_file = 'index.html'
    template_args = {'deps': deps}
    rendered_template = get_rendered_template(
        template_dir,
        index_template_file, 
        template_args
    )

    out_file = '../index.html'
    with open(out_file, 'w') as f:
        f.write(rendered_template)
