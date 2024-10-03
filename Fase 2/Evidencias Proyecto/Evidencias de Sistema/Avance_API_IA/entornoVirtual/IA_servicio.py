import random

class AIService:
    def __init__(self):
        self.responses = [
            "That's an interesting question about {topic}. In the tech world, we're seeing rapid advancements in this area.",
            "When it comes to {topic}, there have been several recent developments. Many experts believe this field will continue to grow.",
            "{topic} is a hot topic in the tech industry right now. Companies are investing heavily in research and development.",
            "The future of {topic} looks promising. We're seeing innovative applications in various sectors.",
            "Regarding {topic}, it's important to consider both the potential benefits and ethical implications as the technology evolves."
        ]

    def generate_response(self, user_message):
        # Extract a potential topic from the user message
        # In a real implementation, this would involve more sophisticated NLP
        topic = user_message.split()[-1] if user_message else "technology"

        # Select a random response and format it with the extracted topic
        response = random.choice(self.responses).format(topic=topic)

        return response
# Additional IA Service Logic from ParteAlonso
import chromadb
from api_servicio import obtener_titulares_resumidos  # Importamos la función para obtener noticias
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.chat_models import ChatOllama
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.prompts import PromptTemplate
from langchain_core.messages import HumanMessage

# Inicializar el modelo Ollama con LLaMA 3.2
llm = ChatOllama(model='llama3.2', temperature=0.7)

# Crear la base de vectores local usando Chroma
chroma_db = Chroma(
    collection_name="news_data",
    client=chromadb.PersistentClient(path='./vectordb_gratis'),  # Base de vectores local
    embedding_function=HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
)

def generar_prompt_con_noticias(noticias):
    """
    Genera un contexto basado en las noticias obtenidas de la API para ser utilizado en el prompt.
    """
    contexto = "A continuación te muestro un conjunto de 3 noticias:\n\n"
    
    for noticia in noticias:
        contexto += f"Título: {noticia['titulo']}\nDescripción: {noticia['descripcion']}\n\n"
    
    return contexto  # Solo retornamos el contexto, no un prompt adicional


# def obtener_respuesta(pregunta, noticias):
#     """
#     Función que toma la pregunta del usuario y el contexto de noticias para generar una respuesta.
#     """
#     retriever = chroma_db.as_retriever()  # Sistema de recuperación de información de la base de vectores
    
#     # Verificar qué datos se están recibiendo como noticias
#     print("Noticias obtenidas:", noticias)  # Imprimir las noticias para verificar el formato

#     # Generamos el prompt y el contexto a partir de las noticias
#     prompt, contexto = generar_prompt_con_noticias(noticias)
    
#     # Imprimir el contexto de noticias para verificar que se generó correctamente
#     print("Contexto generado basado en las noticias:")
#     print(contexto)  # Verificar el contexto

#     # Imprimir el prompt generado para verificar que contiene la información correcta
#     print("Prompt generado para el modelo:")
#     print(prompt.template)  # Verificar el prompt
    
#     # Combinar el modelo Ollama con el retriever de vectores
#     chain = create_stuff_documents_chain(llm, prompt)
#     rag = create_retrieval_chain(retriever, chain)
    
#     # Pasamos tanto la entrada del usuario como el contexto a la cadena
#     results = rag.invoke({"input": pregunta, "context": contexto})
    
#     return results['answer']

def obtener_respuesta(pregunta, contexto):
    """
    Función que utiliza el modelo de IA para generar un resumen basado en el contexto de noticias
    y la pregunta del usuario.
    """
    # Personalizar el prompt usando la pregunta del usuario y el contexto de noticias
    prompt = (
        f"A continuación te presento un conjunto de 3 noticias:\n\n{contexto}\n\n"
        f"Pregunta: {pregunta}\n\n"
        "Por favor, genera un resumen basado en estas noticias y responde específicamente "
        "a la pregunta del usuario."
    )
    
    # Crear los mensajes que se enviarán al modelo
    messages = [HumanMessage(content=prompt)]
    
    # Llamar al modelo Ollama para generar la respuesta
    response = llm.invoke(messages)
    
    # Devolver el contenido de la respuesta generada por el modelo
    return response.content


def procesar_pregunta_ia(categoria="general", pais="us"):
    """
    Procesa las noticias obtenidas y utiliza el modelo LLaMA 3.2 para generar un resumen personalizado.
    """
    # Obtener titulares y descripciones de las noticias (máximo 3 artículos)
    noticias_resumidas = obtener_titulares_resumidos(categoria, pais)
    
    if 'error' in noticias_resumidas:
        return noticias_resumidas['error']
    
    # Generar el prompt con el contexto de las noticias obtenidas
    contexto = generar_prompt_con_noticias(noticias_resumidas)
    
    # Procesar el prompt con el modelo de IA (usamos LLaMA 3.2 a través de Ollama)
    respuesta = obtener_respuesta("Resumir noticias", contexto)
    
    return respuesta  # Devolver el resumen generado por el modelo
