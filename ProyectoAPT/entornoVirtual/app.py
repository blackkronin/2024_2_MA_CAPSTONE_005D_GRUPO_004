from flask import Flask, jsonify, request, render_template, session, Response, send_from_directory
from flask_cors import CORS 
import requests
from dotenv import load_dotenv
import os
from noticias_servicio import NoticiasService
from IA_servicio import OllamaClient
import json

#load_dotenv()
app= Flask(__name__)
app.static_folder ='static'
app.static_url_path='/static'

CORS(app)

#NEWS_API_KEY= os.getenv('NEWS_API_KEY')
NEWS_API_KEY= 'dc53a73695e74e2a9963e2071dc47e8b'
#news_service= NoticiasService(NEWS_API_KEY)
NEWS_API_URL= 'https://newsapi.org/v2/top-headlines'


ollama_client  = OllamaClient()


# response= requests.get(NEWS_API_URL)
# data = response.json()
# print(data)


@app.route('/static/chatScript.js')
def  send_js(path):
    return send_from_directory('static',path)



#Path navegacion
@app.route("/base")
def template_base():
    return render_template("base.html")

@app.route("/")
def template_index():
    news=fetch_news()
    return render_template('index.html', articles=news['articles'] if news else [])

@app.route("/noticias")
def template_noticias():
    query= request.args.get('q')
    if query:
        results= search_news(query)
        return render_template('noticiasApi.html', articles=results['articles'] if results else[], query=query )
    return render_template("noticias.html")



#IA
@app.route("/chat")
def template_chat():
    return render_template("chat.html")


#rutas de inteligencia artificial
@app.route("/generate_text",methods=['POST'])
def generate_text():
    """
    Generar texto usando un modelo.
    ---
    parameters:
      - name: body
        in: body
        required: True
        schema:
          type: object
          required:
            - model
            - prompt
          properties:
            model:
              type: string
              description: El nombre del modelo a usar.
            prompt:
              type: string
              description: El prompt para generar texto.
    responses:
      200:
        description: Texto generado
        schema:
          type: object
          properties:
            generated_text:
              type: string
              description: El texto generado por el modelo. 
    """
    data = request.json
    model= data.get('model')
    prompt = data.get('prompt')
    response=ollama_client.generate_text(model,prompt)
    return jsonify(response)

@app.route('/generate_text_stream', methods=['POST'])
def generate_text_stream():
    """
    Generar texto usando un modelo con streaming.
    ---
    parameters:
      - name: body
        in: body
        required: True
        schema:
          type: object
          required:
            - model
            - prompt
          properties:
            model:
              type: string
              description: El nombre del modelo a usar.
            prompt:
              type: string
              description: El prompt para generar texto.
    responses:
      200:
        description: Texto generado
        schema:
          type: object
          properties:
            generated_text:
              type: string
              description: El texto generado por el modelo.
    """
    data = request.json
    model = data.get('model')
    prompt = data.get('prompt')
    def generate():
        for response in ollama_client.generate_text_stream(model,prompt):
            yield json.dumps(response) + '\n'

    return Response(generate(), content_type='application/json')

#reemplaza funcion /generate_places
#la idea es que busque noticias en la api y devuelva JSON
#esta ruta deberia adjuntar en un bloque las fuentes de cada noticia
@app.route('/search_news', methods=['POST'])
def search_news():
    data = request.json
    query=data.get('query')

    #llama a la API para buscar articulos de noticias
    params = {'q':query, 'apiKey': NEWS_API_KEY}
    try:
        response = requests.get('https://newsapi.org/v2/everything', params=params)
        response.raise_for_status()
        news_articles= response.json()
    except requests.RequestException as e:
        print(f"Error searching news: {e}")
        return jsonify({'error': 'Error al buscar noticias'}), 500
    

    response_text=''
    for article in news_articles['articles']:
        response_text += f"{article['title']}: {article['description']}\n"
    
    return jsonify({'response':response_text}),200
    # query = data.get('query')
    # results = search_news(query)
    # return jsonify(results)

@app.route('/chat', methods=['POST'])
def chat():
    """
    Crear una conversación usando un modelo.
    ---
    parameters:
      - name: body
        in: body
        required: True
        schema:
          type: object
          required:
            - model
            - messages
          properties:
            model:
              type: string
              description: El nombre del modelo a usar.
            messages:
              type: array
              items:
                type: object
                properties:
                  role:
                    type: string
                    description: El rol del mensaje (e.g., user, assistant).
                  content:
                    type: string
                    description: El contenido del mensaje.
    responses:
      200:
        description: Respuesta de chat
        schema:
          type: object
          properties:
            response:
              type: object
              description: La respuesta del modelo de chat.
    """
    data= request.json
    model=data.get('model')
    messages= data.get('messages')
    response=ollama_client.chat(model,messages)
    return jsonify(response)

@app.route('/create_model', methods=['POST'])
def create_model():
    """
    Crear un modelo.
    ---
    parameters:
      - name: body
        in: body
        required: True
        schema:
          type: object
          required:
            - model
            - path
          properties:
            model:
              type: string
              description: El nombre del modelo a crear.
            path:
              type: string
              description: La ruta al archivo del modelo.
            modelfile:
              type: string
              description: El archivo del modelo (opcional).
            quantize:
              type: string
              description: La opción de cuantización (opcional).
    responses:
      200:
        description: Modelo creado
        schema:
          type: object
          properties:
            status:
              type: string
              description: El estado de la creación del modelo.
    """
    data = request.json
    model = data.get('model')
    path = data.get('path')
    modelfile =data.get('modelfile')
    quantize= data.get('quantize')
    
    response = ollama_client.create_model(model, path, modelfile, quantize)
    return jsonify(response)



@app.route('/delete_model<model>', methods=['POST'])
def delete_model(model):
    """
    Eliminar un modelo.
    ---
    parameters:
      - name: model
        in: path
        type: string
        required: True
        description: El nombre del modelo a eliminar.
    responses:
      200:
        description: Modelo eliminado
        schema:
          type: object
          properties:
            status:
              type: string
              description: El estado de la eliminación del modelo.
    """
    response= ollama_client.delete_model(model)
    return jsonify(response)

@app.route('/list_models',methods=['GET'])
def list_models():
    """
    Listar todos los modelos.
    ---
    responses:
      200:
        description: Lista de modelos
        schema:
          type: object
          properties:
            models:
              type: array
              items:
                type: string
                description: Los nombres de los modelos.
    """
    response = ollama_client.list_models()
    return jsonify(response)




#funciones api

def fetch_news(country='us', category='technology'):
    params={'country':country,
            'category':category,
            'apiKey':NEWS_API_KEY}
    try:
        response=requests.get(NEWS_API_URL, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return (f"Error searching news: {e}")

def search_newsAPI(query):
    params={
        'q':query,
        'apiKey':NEWS_API_KEY
    }
    try:
        response=  requests.get('https://newsapi.org/v2/everything', params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e: 
        print(f"Error searching news: {e}")
        return None




if __name__=="__main__":
    app.run(debug=True, port=5001)