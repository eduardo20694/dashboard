function carregarConteudoIa() {
    document.getElementById('popupContentIaOnline').textContent = `
import mysql.connector
import numpy as np
import random
import logging
import pickle
import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

logging.basicConfig(level=logging.DEBUG)

modelo_embedding = SentenceTransformer('paraphrase-MiniLM-L12-v2')  # Modelo  NLP

class BancoDeDados:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host, user=user, password=password, database=database
        )
        self.cursor = self.conn.cursor()

    def execute_query(self, query, params=None):
        if params:
            self.cursor.execute(query, params)
        else:
            self.cursor.execute(query)
        return self.cursor.fetchall()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.cursor.close()
        self.conn.close()

def carregar_dados():
    db = BancoDeDados("1X7.X.X.X", "XXXX", "eduardoXXXX", "XXXXXXXXXXX")
    
    query = "SELECT id, pergunta, resposta FROM conhecimento WHERE ativo = TRUE"
    dados = db.execute_query(query)
    
    db.close()
    
    if not dados:
        return [], [], {}

    ids, perguntas, respostas = zip(*dados)
    return list(ids), list(perguntas), list(respostas)

def adicionar_pergunta_resposta(pergunta, resposta, categoria_id, tags=[]):
    db = BancoDeDados("1X7.X.X.X", "XXXX", "eduardoXXXX", "XXXXXXXXXXX")
    
    query = "INSERT INTO conhecimento (pergunta, resposta, categoria_id, ativo) VALUES (%s, %s, %s, TRUE)"
    db.execute_query(query, (pergunta, resposta, categoria_id))
    db.commit()

    pergunta_id = db.cursor.lastrowid
    
    for tag in tags:
        query = "SELECT id FROM tags WHERE nome = %s"
        tag_id_result = db.execute_query(query, (tag,))
        
        if tag_id_result:
            tag_id = tag_id_result[0][0]
        else:
            query = "INSERT INTO tags (nome) VALUES (%s)"
            db.execute_query(query, (tag,))
            db.commit()
            tag_id = db.cursor.lastrowid
        
        query = "INSERT INTO pergunta_tags (pergunta_id, tag_id) VALUES (%s, %s)"
        db.execute_query(query, (pergunta_id, tag_id))
        db.commit()

    db.close()
    logging.info(f"Nova pergunta adicionada: {pergunta}")

def adicionar_frase(texto):
    db = BancoDeDados("1X7.X.X.X", "XXXX", "eduardoXXXX", "XXXXXXXXXXX")
    
    query = "INSERT INTO frases (texto) VALUES (%s)"
    db.execute_query(query, (texto,))
    db.commit()
    
    db.close()
    logging.info(f"Nova frase adicionada: {texto}")


def buscar_frase():
    db = BancoDeDados("1X7.X.X.X", "XXXX", "eduardoXXXX", "XXXXXXXXXXX")
    
    query = "SELECT texto FROM frases"
    frases = db.execute_query(query)
    
    db.close()
    
    return random.choice(frases)[0] if frases else "Ainda não há frases cadastradas."

def gerar_embeddings(perguntas):
    return np.array(modelo_embedding.encode(perguntas, normalize_embeddings=True))  # Normalização melhora precisão

def salvar_embeddings(embeddings, arquivo="embeddings.pkl"):
    with open(arquivo, "wb") as f:
        pickle.dump(embeddings, f)

def carregar_embeddings(arquivo="embeddings.pkl"):
    if os.path.exists(arquivo):
        with open(arquivo, "rb") as f:
            return pickle.load(f)
    return None

def validar_pergunta(pergunta):
    if not pergunta.strip():
        return False, "Por favor, insira uma pergunta válida."
    return True, ""

def encontrar_resposta(pergunta, perguntas_embeddings, respostas, limite_similaridade=0.6):
    logging.debug(f"Procurando resposta para: {pergunta}")
    
    embedding_pergunta = modelo_embedding.encode([pergunta], normalize_embeddings=True)
    
    similaridades = cosine_similarity(embedding_pergunta, perguntas_embeddings)[0]
    
    indice_mais_similar = np.argmax(similaridades)
    maior_similaridade = similaridades[indice_mais_similar]

    logging.debug(f"Similaridade encontrada: {maior_similaridade:.2f}")
    
    if maior_similaridade < limite_similaridade:
        return buscar_frase()
    
    return respostas[indice_mais_similar]

def main():
    # Carregar perguntas e respostas
    ids, perguntas, respostas = carregar_dados()
    logging.debug("📌 Perguntas e respostas carregadas com sucesso!")

    perguntas_embeddings = carregar_embeddings()
    if perguntas_embeddings is None or perguntas_embeddings.size == 0:  # Verificação correta de embeddings
        perguntas_embeddings = gerar_embeddings(perguntas)
        salvar_embeddings(perguntas_embeddings)
        logging.debug("📌 Embeddings gerados e salvos com sucesso!")
    else:
        logging.debug("📌 Embeddings carregados do arquivo.")

    while True:
        print("\n1. Fazer uma pergunta!")
        print("2. Adicionar uma nova pergunta e resposta...")
        print("3. Adicionar uma nova frase...")
        print("4. Sair")
        opcao = input("Escolha uma opção: ")

        if opcao == "1":
            pergunta_usuario = input("\nFaça uma pergunta: ")

            is_valid, feedback = validar_pergunta(pergunta_usuario)
            if not is_valid:
                print(f"❌ {feedback}")
                continue

            resposta = encontrar_resposta(pergunta_usuario, perguntas_embeddings, respostas)
            print(f"🤖 IA: {resposta}")

        elif opcao == "2":
            nova_pergunta = input("Digite a nova pergunta: ")
            nova_resposta = input("Digite a resposta para essa pergunta: ")

            db = BancoDeDados("1X7.X.X.X", "XXXX", "eduardoXXXX", "XXXXXXXXXXX")
            query = "SELECT id, nome FROM categorias"
            categorias = db.execute_query(query)
            db.close()
            
            print("\nCategorias disponíveis:")
            for categoria in categorias:
                print(f"{categoria[0]}. {categoria[1]}")

            categoria_id = int(input("\nEscolha a categoria (ID): "))
            
            tags_input = input("Digite as tags separadas por vírgula (ex: tag1, tag2): ")
            tags = [tag.strip() for tag in tags_input.split(",")]

            adicionar_pergunta_resposta(nova_pergunta, nova_resposta, categoria_id, tags)

            ids, perguntas, respostas = carregar_dados()
            perguntas_embeddings = gerar_embeddings(perguntas)
            salvar_embeddings(perguntas_embeddings)

            print("✔️ Nova pergunta e resposta adicionadas com sucesso!")

        elif opcao == "3":
            nova_frase = input("Digite a nova frase: ")
            adicionar_frase(nova_frase)
            print("✔️ Nova frase adicionada com sucesso!")

        elif opcao == "4":
            print("Saindo...")
            break

        else:
            print("Opção inválida. Tente novamente.")

        if __name__ == "__main__":
                main() ` ;
}

document.getElementById('abrirPopupIaOnline').addEventListener('click', function () {
    document.getElementById('popupOverlayIaOnline').style.display = 'flex';
    carregarConteudoIa();
});

document.getElementById('fecharPopupIaOnline').addEventListener('click', function () {
    document.getElementById('popupOverlayIaOnline').style.display = 'none';
});


document.getElementById('btnIaDesc').addEventListener('click', function () {
    carregarConteudoIa(); 
    ativarBotaoIa(this);
});


function ativarBotaoIa(botaoClicado) {
    document.querySelectorAll('.popupNav button').forEach(btn => btn.classList.remove('active'));
    botaoClicado.classList.add('active');
}






