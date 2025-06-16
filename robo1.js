const openPopup = document.getElementById('openPopup');
  const popupOverlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('closeBtn');
  const btnDesc = document.getElementById('btnDesc');
  const btnDetalhes = document.getElementById('btnDetalhes');
  const popupContent = document.getElementById('popupContent');

  openPopup.addEventListener('click', () => {
    popupOverlay.classList.add('active');
    setActiveTab('desc');
  });

  closeBtn.addEventListener('click', () => {
    popupOverlay.classList.remove('active');
  });

  btnDesc.addEventListener('click', () => setActiveTab('desc'));
  btnDetalhes.addEventListener('click', () => setActiveTab('detalhes'));

  function setActiveTab(tab) {
    if(tab === 'desc') {
      btnDesc.classList.add('active');
      btnDetalhes.classList.remove('active');
      popupContent.textContent = `

from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

embedding_model = SentenceTransformer('paraphrase-MiniLM-L12-v2')


perguntas_respostas = {
  
    BASE DE RESPOSTAS PESSOIAS

}

perguntas = list(perguntas_respostas.keys())
respostas = list(perguntas_respostas.values())
perguntas_embeddings = embedding_model.encode(perguntas, normalize_embeddings=True)

def encontrar_resposta(pergunta_usuario):
    embedding_usuario = embedding_model.encode([pergunta_usuario], normalize_embeddings=True)
    similaridades = cosine_similarity(embedding_usuario, perguntas_embeddings)[0]
    
    indice = np.argmax(similaridades)
    score = similaridades[indice]
    
    if score > 0.6:
        return respostas[indice]
    elif score > 0.4:
        return "🤖 Não tenho certeza, mas talvez esteja se referindo a: " + respostas[indice]
    else:
        return "🤖 Desculpe, não consegui entender bem. Pode reformular sua pergunta?"

def interagir_com_ia():
    print("🤖 IA: Olá! Pode me perguntar qualquer coisa sobre o Eduardo.")
    while True:
        pergunta = input("\nVocê: ")
        if pergunta.lower() in ['sair', 'exit', 'quit']:
            print("🤖 IA: Até logo!")
            break
        resposta = encontrar_resposta(pergunta)
        print("🤖 IA:", resposta)

if __name__ == "__main__":
    interagir_com_ia() `


        } else {
      btnDetalhes.classList.add('active');
      btnDesc.classList.remove('active');
      popupContent.textContent = `
      
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
from functools import lru_cache

app = Flask(__name__)

embedding_model = SentenceTransformer('paraphrase-MiniLM-L12-v2')

perguntas_respostas = {

    BANCO DE RESPOSTAS PESSOAL
}

@lru_cache(maxsize=100)
def gerar_embeddings(perguntas):
    return np.array(embedding_model.encode(perguntas, normalize_embeddings=True)) 

def encontrar_resposta(pergunta_usuario):
    
    perguntas = list(perguntas_respostas.keys())
    respostas = list(perguntas_respostas.values())

   
    perguntas_embeddings = gerar_embeddings(tuple(perguntas))  
    
    embedding_pergunta_usuario = embedding_model.encode([pergunta_usuario], normalize_embeddings=True)

    similaridades = cosine_similarity(embedding_pergunta_usuario, perguntas_embeddings)[0]
    
    indice_mais_similar = np.argmax(similaridades)
    maior_similaridade = similaridades[indice_mais_similar]

    
    if maior_similaridade > 0.6:  # Limitador de similaridade
        return respostas[indice_mais_similar]
    
    return "Desculpe, não consegui encontrar uma resposta precisa para a sua pergunta."

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "mensagem": "Bem-vindo à API de Perguntas e Respostas!",
        "instrucoes": "Use o endpoint POST /pergunta para enviar perguntas no formato JSON.",
        "exemplo": {
            "url": "/pergunta",
            "formato": {"pergunta": "sua pergunta aqui"}
        }
    }), 200

@app.route('/pergunta', methods=['POST'])
def responder_pergunta():
    
    data = request.json
    pergunta_usuario = data.get('pergunta', '')

    if pergunta_usuario:
        resposta = encontrar_resposta(pergunta_usuario)
        return jsonify({'resposta': resposta}), 200
    else:
        return jsonify({'error': 'Pergunta não fornecida'}), 400

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)`
    }
  }