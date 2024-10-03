from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, Length
from flask_bcrypt import Bcrypt
from wtforms.widgets import CheckboxInput, ListWidget
from wtforms.fields import SelectMultipleField
from models import get_user_by_email

bcrypt = Bcrypt()

class RegisterForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired(), Length(min=4, max=20)])
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired(), Length(min=8)])
    interests = SelectMultipleField('Interests', 
                                    widget=ListWidget(html_tag='ul', prefix_label=False),
                                    option_widget=CheckboxInput(),
                                    choices=[
                                        ('tech', 'Technology'),
                                        ('sport', 'Sports'),
                                        ('music', 'Music'),
                                        ('art', 'Art'),
                                        # Add more options as needed
                                    ])
    submit = SubmitField("Registrarse")

    def validate_password(self, field):
        hashed_password = bcrypt.generate_password_hash(field.data).decode('utf-8')
        # Guardar la contraseña hashéada en la base de datos
        pass

class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired(), Length(min=8)])
    submit = SubmitField("Iniciar sesión")

class EditProfileForm(FlaskForm):
    username = StringField("Nombre", validators=[DataRequired(), Length(min=4, max=20)])
    password = PasswordField("Nueva contraseña", validators=[Length(min=8)])  # Sin DataRequired(), es opcional
    interests = StringField("Intereses", validators=[Length(max=255)])  # Este campo también es opcional
    submit = SubmitField("Actualizar perfil")