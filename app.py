from flask import Flask, render_template, request, jsonify
from model import get_answer

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/prompt', methods=['POST'])
def upload():
    if "passage" not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    query = request.form.get('query')
    passage = request.files['passage'].read().decode('utf-8')

    try:
        answer = get_answer(query=query,passage=passage)
        # "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    except:
        answer = "Sorry. Try again after sometime"

    # if query.lower() == "hi":
    #     answer = "This fucking message has been recieved"
    # else:
    #     answer = passage

    return jsonify(
        {
            "answer":answer
        }
    )

if __name__ == '__main__':
    app.run(debug=True)