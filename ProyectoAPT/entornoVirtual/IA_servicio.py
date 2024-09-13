import ollama

class OllamaClient :
    def __init__(self):
        self.client=ollama.Client()

    def generate_text(self, model: str, prompt: str):
        response = self.client.generate(model=model, prompt=prompt)
        return response
    
    def generate_text_stream(self, model: str, prompt:str):
        response= self.client.generate(model=model, prompt=prompt, stream=True)
        return response
    def generate_text_stream_json(self, model: str,prompt:str):
        response=  self.client.generate(model=model, prompt=prompt, stream=True, format='json')
        return response
    
    def chat (self, model: str, messages: list):
        response = self.client.chat(model=model, messages=messages)
        return response
    
    def create_model(self, model: str, path: str, modelfile:str=None, quantize: str=None):
        response= self.client.create(model=model, path= path , modelfile=modelfile, quantize=quantize)
        return response
    def delete_model(self, model: str):
        response= self.client.delete(model=model)
        return response
    def list_models(self):
        response= self.client.list()
        return response
