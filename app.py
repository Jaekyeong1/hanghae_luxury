from flask import Flask, render_template

from views.login import login
from views.register import register
from views.mainpage import mainpage
from views.addpage import addpage
from views.itempage import itempage

app = Flask(__name__)

app.register_blueprint(login, url_prefix="/home")
app.register_blueprint(register, url_prefix="/register")
app.register_blueprint(mainpage, url_prefix="/mainpage")
app.register_blueprint(addpage, url_prefix="/addpage")
app.register_blueprint(itempage, url_prefix="/itempage")

@app.route("/")
def hello_world():
    return render_template("mainpage.html")


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)