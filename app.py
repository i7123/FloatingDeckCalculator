from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Default configuration
app.config.update(
    DEBUG=True
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        length = float(data.get('length', 0))
        width = float(data.get('width', 0))
        
        # TODO: Add calculation logic here
        # This is a placeholder response
        result = {
            'deck_boards': 0,
            'base_wood': 0,
            'screws': 0,
            'fasteners': []
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run()
