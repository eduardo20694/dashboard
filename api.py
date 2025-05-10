from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SENHA_GLOBAL = "eduardo20694"

@app.route('/validar-senha', methods=['POST'])
def validar_senha():
    data = request.get_json()
    senha = data.get("senha")
    if senha == SENHA_GLOBAL:
        return jsonify({"autorizado": True})
    return jsonify({"autorizado": False}), 401

if __name__ == '__main__':
    app.run(debug=True)
