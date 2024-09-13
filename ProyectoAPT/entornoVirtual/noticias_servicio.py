import requests 
class NoticiasService:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://newsapi.org/v2'

    def get_news(self, country, category):
        url = f"{self.base_url}/top-headlines"
        params = {
            'country': country,
            'category': category,
            'apiKey': self.api_key
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    def search_newsAPI(self, query):
        url = f"{self.base_url}/everything"
        params = {
            'q': query,
            'apiKey': self.api_key
        }
        
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()