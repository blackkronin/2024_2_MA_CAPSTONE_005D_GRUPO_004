from flask import Flask, jsonify, request, render_template
from flask_cors import CORS 
import requests
from dotenv import load_dotenv
import os
from noticias_servicio import NoticiasService

#load_dotenv()
app= Flask(__name__)
CORS(app)

#NEWS_API_KEY= os.getenv('NEWS_API_KEY')
NEWS_API_KEY= 'dc53a73695e74e2a9963e2071dc47e8b'
#news_service= 
NEWS_API_URL= 'https://newsapi.org/v2/top-headlines'


# response= requests.get(NEWS_API_URL)
# data = response.json()
# print(data)


@app.route("/base")
def template_base():
    return render_template("base.html")

@app.route("/")
def template_index():
    news=fetch_news()
    return render_template('index.html', articles=news['articles'] if news else [])

@app.route("/chat")
def template_chat():
    return render_template("chat.html")


@app.route("/noticias")
def template_noticias():
    query= request.args.get('q')
    if query:
        results= search_news(query)
        return render_template('noticiasApi.html', articles=results['articles'] if results else[], query=query )
    return render_template("noticias.html")



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

def search_news(query):
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