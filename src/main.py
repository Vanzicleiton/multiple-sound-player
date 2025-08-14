import http.server
import socketserver
import webbrowser
import os

PORTA = 8000

# Diretório atual
diretorio = os.path.abspath(os.path.dirname(__file__))
os.chdir(diretorio)

# Handler padrão
Handler = http.server.SimpleHTTPRequestHandler

# Servidor
with socketserver.TCPServer(("", PORTA), Handler) as httpd:
    print(f"Servidor rodando em http://localhost:{PORTA}")
    
    # Abrir navegador
    webbrowser.open(f"http://localhost:{PORTA}")
    
    # Iniciar servidor
    httpd.serve_forever()
