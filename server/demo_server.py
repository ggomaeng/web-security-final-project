from flask import Flask, request, render_template_string, render_template, Markup

app = Flask(__name__, template_folder='template')

@app.route('/', methods=['GET'])
def welcome(): 
	return "<h1> welcome to our demo server!</h1>"

@app.route('/contact-info', methods=['GET', 'POST'])
def contact_info(): 
	if request.method == "GET": 
		template = "contact.html"
		return render_template(template)

@app.route('/contact_submit', methods=['GET', 'POST'])
def contact_submit(): 
	template = "contact-submit.html"
	if request.method == "POST":
		
		print(request.args)
		print(request.form.get('name'))
		name = request.form.get('name')
		return render_template(template, name=name)

	return render_template(template)


####
# Private function if the user has local files.
###
# def get_user_file(f_name):
# 	with open(f_name) as f:
# 		return f.readlines()


# app.jinja_env.globals['get_user_file'] = get_user_file # Allows for use in Jinja2 templates


if __name__ == "__main__":
	app.run(debug=True)
	

