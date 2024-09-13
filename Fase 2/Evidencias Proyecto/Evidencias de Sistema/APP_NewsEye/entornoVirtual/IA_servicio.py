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