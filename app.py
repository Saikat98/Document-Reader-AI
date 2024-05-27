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
    except:
        answer = "Sorry. Try again after sometime"

    return jsonify(
        {
            "answer":answer
        }
    )

if __name__ == '__main__':
    app.run(debug=True)