"""Servidor de demos.

Cada carpeta dentro de demos/ es una web:

  - Si la carpeta tiene su propio app.py (una app Flask, como "ropa"),
    se monta tal cual en /<carpeta>/   ->  /ropa/, /ropa/catalogo, ...
  - Si solo tiene HTML/CSS (como "motos"), se sirve como página estática
    ->  /motos/  ->  demos/motos/index.html

Para PythonAnywhere, el archivo WSGI debe importar `application`:
    from app import application
"""
import importlib.util
import os
import sys

from flask import Flask, redirect, request, send_from_directory
from werkzeug.middleware.dispatcher import DispatcherMiddleware

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demos")


# --- Demos estáticas (HTML/CSS) ---
app = Flask(__name__, static_folder=None)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def demos(path):
    full = os.path.join(BASE, path)
    if os.path.isdir(full):
        # /motos -> /motos/  (necesario para que carguen css/ e img/)
        if path and not request.path.endswith("/"):
            return redirect(request.path + "/", code=301)
        return send_from_directory(full, "index.html")
    return send_from_directory(BASE, path)


# --- Demos que son apps Flask (tienen su propio app.py) ---
def cargar_app_flask(nombre, ruta_app):
    """Importa demos/<nombre>/app.py con un nombre de módulo único."""
    modulo = f"demo_{nombre.replace('-', '_')}"
    spec = importlib.util.spec_from_file_location(modulo, ruta_app)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[modulo] = mod          # Flask lo necesita para encontrar templates/ y static/
    spec.loader.exec_module(mod)
    return mod.app


montajes = {}
for nombre in sorted(os.listdir(BASE)):
    ruta_app = os.path.join(BASE, nombre, "app.py")
    if os.path.isfile(ruta_app):
        montajes[f"/{nombre}"] = cargar_app_flask(nombre, ruta_app)

application = DispatcherMiddleware(app, montajes)


if __name__ == "__main__":
    # Para probar en tu PC: python app.py  ->  http://localhost:5000/motos/  y  /ropa/
    from werkzeug.serving import run_simple
    run_simple("0.0.0.0", 5000, application, use_reloader=True, use_debugger=True)
