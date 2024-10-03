from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from routes import routes
from models import get_user_by_uid

app = Flask(__name__)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'routes.login'

CORS(app)
app.config['SECRET_KEY'] = 'pjbz60IVKSb7{.VzD9xqo&p=B"`N2Mu'

# Registrar el Blueprint de rutas
app.register_blueprint(routes)

# Pasar bcrypt a routes.py
routes.bcrypt = bcrypt

# Registrar el user_loader aquí en app.py
@login_manager.user_loader
def load_user(user_id):
    return get_user_by_uid(user_id)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
