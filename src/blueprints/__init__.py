import importlib
import pkgutil
from flask import Blueprint

def register_blueprints(app):
    """Auto-discover and register all blueprints under src/blueprints/"""
    package = __name__
    prefix = __package__

    for _, module_name, _ in pkgutil.iter_modules([__path__[0]]):
        module = importlib.import_module(f"{prefix}.{module_name}")
        for item in dir(module):
            obj = getattr(module, item)
            if isinstance(obj, Blueprint):
                app.register_blueprint(obj)

