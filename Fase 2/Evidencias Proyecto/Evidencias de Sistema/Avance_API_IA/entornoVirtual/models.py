import mysql.connector

# Setup MySQL connection
def get_db_connection():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",  # Cambia esto por tu usuario de MySQL
        password="",  # Cambia esto por tu contraseña de MySQL
        database="app_newseye"  # Cambia esto por tu base de datos
    )
    return connection

class User:
    def __init__(self, uid, username, email, password, interests):
        self.uid = uid
        self.username = username
        self.email = email
        self.password = password
        self.interests = interests

    def get_id(self):
        return str(self.uid)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

# Function to create a new user
def create_user(username, email, password, interests=None):
    connection = get_db_connection()
    cursor = connection.cursor()
    interests_str = ','.join(interests) if interests else None  # Convertir lista a cadena separada por comas
    cursor.execute('INSERT INTO users (username, email, password, interests) VALUES (%s, %s, %s, %s)', 
                   (username, email, password, interests_str))
    connection.commit()
    cursor.close()
    connection.close()

# Function to get a user by email
def get_user_by_email(email):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM users WHERE email = %s', (email,))
    user_data = cursor.fetchone()
    cursor.close()
    connection.close()
    if user_data:
        interests_list = user_data[4].split(',') if user_data[4] else []  # Dividir la cadena en una lista
        return User(user_data[0], user_data[1], user_data[2], user_data[3], interests_list)
    return None

def get_user_by_uid(uid):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM users WHERE uid = %s', (uid,))
    user_data = cursor.fetchone()
    cursor.close()
    connection.close()
    if user_data:
        interests_list = user_data[4].split(',') if user_data[4] else []  # Dividir la cadena en una lista
        return User(user_data[0], user_data[1], user_data[2], user_data[3], interests_list)
    return None

def update_user_profile(uid, new_username=None, new_password=None, new_interests=None):
    connection = get_db_connection()
    cursor = connection.cursor()

    # Generamos una consulta dinámica dependiendo de qué campos se quieran actualizar
    query = 'UPDATE users SET '
    values = []

    if new_username:
        query += 'username = %s, '
        values.append(new_username)
    
    if new_interests:
        query += 'interests = %s, '
        values.append(new_interests)
    
    if new_password:
        query += 'password = %s, '
        values.append(new_password)

    # Verifica si al menos se actualiza algún campo
    if not values:
        return  # No hay nada que actualizar

    # Eliminamos la última coma y agregamos el WHERE clause
    query = query.rstrip(', ') + ' WHERE uid = %s'
    values.append(uid)

    try:
        cursor.execute(query, tuple(values))
        connection.commit()
        print("Perfil actualizado en la base de datos")  # Mensaje de depuración
    except Exception as e:
        print(f"Error en la consulta SQL: {e}")
        raise
    finally:
        cursor.close()
        connection.close()