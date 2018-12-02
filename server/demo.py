from flask import Flask, request, render_template_string, render_template

app = Flask(__name__, template_folder='template')

@app.route('/hello-string')
def hello_ssti():
	person = {'name':"world", 'secret':"UGhldmJoZj8gYWl2ZnZoei5wYnovcG5lcnJlZg=="}
	if request.args.get('name'):
		person['name'] = request.args.get('name')
	template = '''<h2>Hello %s!</h2>''' % person['name']
	return render_template_string(template, person=person)


@app.route('/hello-template')
def hello_xss():
	name = "world"
	template = 'hello.unsafe' # 'unsafe' file extension... totally legit.
	if request.args.get('name'):
		name = request.args.get('name')
	return render_template(template, name=name)

####
# Private function if the user has local files.
###
def get_user_file(f_name):
	with open(f_name) as f:
		return f.readlines()

@app.route("/")
def get():
    template = ''' {  extends "layout.html"  }
{  block body  }
    <div class="center-content error">
        <h1>Oops! That page doesn't exist. 404 Er</h1>
        <h3>%s</h3>
    </div>
{  endblock  }
''' % (request.url)
    return render_template_string(template,
        dir=dir,
        help=help,
        locals=locals,
    ), 404

app.jinja_env.globals['get_user_file'] = get_user_file # Allows for use in Jinja2 templates

if __name__ == "__main__":
	app.run(debug=True)
	

