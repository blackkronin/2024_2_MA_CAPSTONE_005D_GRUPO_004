from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, current_user, login_required
from models import create_user, get_user_by_email, get_user_by_uid
from forms import RegisterForm, LoginForm, EditProfileForm
import requests
from noticias_servicio import obtener_todas_las_noticias
from IA_servicio import procesar_pregunta_ia

from flask_bcrypt import Bcrypt
bcrypt = Bcrypt()  # No necesitas pasar la instancia de `app` directamente aquí


# Crear un Blueprint para las rutas
routes = Blueprint('routes', __name__)

# Variables globales

NEWS_API_KEY = 'dc53a73695e74e2a9963e2071dc47e8b'
NEWS_API_URL = 'https://newsapi.org/v2/top-headlines'


# Rutas
@routes.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        create_user(form.username.data, form.email.data, hashed_password, form.interests.data)
        return redirect(url_for('routes.login'))  # Cambiado a 'routes.login'
    return render_template('register.html', form=form)

@routes.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('routes.profile'))  # Cambiado a 'routes.profile'

    form = LoginForm()
    if form.validate_on_submit():
        user = get_user_by_email(form.email.data)
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user)
            flash('Inicio de sesión exitoso.', 'success')
            return redirect(url_for('routes.profile'))  # Cambiado a 'routes.profile'
    return render_template('login.html', form=form)

@routes.route('/logout')
def logout():
    logout_user()
    flash('Has cerrado sesión exitosamente.', 'success')
    return redirect(url_for('routes.login'))  # Cambiado a 'routes.login'

@routes.route("/")
def template_index():
    news = fetch_news()
    return render_template('index.html', articles=news['articles'] if news else [])

@routes.route("/base")
def template_base():
    return render_template("base.html")

@routes.route("/noticias")
def template_noticias():
    query = request.args.get('q')
    if query:
        results = search_news(query)
        return render_template('noticiasApi.html', articles=results['articles'] if results else [], query=query)
    return render_template("noticias.html")

@routes.route('/edit_profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm()

    if form.validate_on_submit():
        # Verifica si el usuario cambió la contraseña
        if form.password.data:
            hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
            current_user.password = hashed_password

        # Actualiza los gustos/intereses
        current_user.interests = form.interests.data

        # Actualiza el perfil en la base de datos
        update_user_profile(current_user)

        flash('Your profile has been updated!', 'success')
        return redirect(url_for('routes.profile'))

    elif request.method == 'GET':
        # Pre-cargar los datos actuales del usuario en el formulario
        form.interests.data = current_user.interests

    return render_template('edit_profile.html', form=form)

@routes.route('/profile', methods=['GET'])
@login_required
def profile():
    # Solo visualizar los datos del usuario sin instanciar el formulario
    return render_template('profile.html', username=current_user.username, 
                           email=current_user.email, interests=current_user.interests)


# Funciones para obtener noticias
def fetch_news(country='us', category='technology'):
    params = {'country': country, 'category': category, 'apiKey': NEWS_API_KEY}
    try:
        response = requests.get(NEWS_API_URL, params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return f"Error searching news: {e}"

def search_news(query):
    params = {'q': query, 'apiKey': NEWS_API_KEY}
    try:
        response = requests.get('https://newsapi.org/v2/everything', params=params)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return None

@routes.route('/')
def index():
    categoria = request.args.get('categoria', 'general')
    pais = request.args.get('pais', 'us')
    noticias = obtener_todas_las_noticias(categoria=categoria, pais=pais)

    # Handle the case where 'noticias' might be None
    if noticias is None:
        noticias = []  # Set to empty list if no news is fetched

    return render_template('index.html', noticias=noticias)

@routes.route('/chat', methods=['GET', 'POST'])
def chat():
    """
    Ruta para el chat con IA que procesa y resume noticias.
    """
    if request.method == 'POST':
        categoria = request.form.get('categoria', 'general')
        pais = request.form.get('pais', 'us')
        respuesta = procesar_pregunta_ia(categoria=categoria, pais=pais)
        return render_template('chat.html', respuesta=respuesta)
    return render_template('chat.html')