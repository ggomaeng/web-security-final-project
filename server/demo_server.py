from flask import Flask, request, render_template_string, render_template, Markup

app = Flask(__name__, template_folder='template')
app.config.from_object('config.BaseConfig')

@app.route('/', methods=['GET'])
def welcome(): 
	if request.args.get('search'):
		search = request.args.get('search')
		template = """
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		<div class="row" align="center">
			<img src="/static/Moriaty.png" style="margin-top: 100px">
		</div>
	    <div class="row" align="center">
	        <h3>Ooops! No results on %s </h3>
	        <h3>Please leave us feedback <a href="/contact-info">Click here!</a></h3>
	    </div>
	""" % (search)
		return render_template_string(template)
		# return render_template_string(response_html)
	return render_template("home.html")


@app.route('/contact-info', methods=['GET', 'POST'])
def contact_info(): 
	if request.method == "GET": 
		template = "contact.html"
		return render_template(template)


@app.route('/contact_submit', methods=['GET', 'POST'])
def contact_submit(): 
	template = "contact-submit.html"
	if request.method == "POST":
		name = request.form.get('name')
		return render_template(template, name=name)

	return render_template(template)

@app.after_request
def add_header(response):
	response.headers['Cache-Control'] = 'no-store'
	return response


####
# Private function if the user has local files.
###
# def get_user_file(f_name):
# 	with open(f_name) as f:
# 		return f.readlines()


# app.jinja_env.globals['get_user_file'] = get_user_file # Allows for use in Jinja2 templates


if __name__ == "__main__":
	app.run(debug=True)
	

