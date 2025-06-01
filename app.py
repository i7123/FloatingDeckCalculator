from flask import Flask, render_template, request, jsonify
from math import ceil

app = Flask(__name__)

# Default configuration
app.config.update(
    DEBUG=True
)

# Constants for calculations (in inches)
BOARD_WIDTH = 5.5  # 5.5 inches for 5/4" x 6" deck board (actual size)
BOARD_LENGTH = 144  # 12 feet in inches
JOIST_SPACING = 16  # inches between joists
JOIST_WIDTH = 1.5  # inches
BEAM_WIDTH = 3.5  # 2x4 on edge for beams
SCREWS_PER_SQFT = 2  # Number of screws per square foot

# Fastener types and quantities per connection
FASTENERS = {
    'joist_hangers': {'size': '1/4" x 1-1/2"', 'quantity_per': 10},  # nails per hanger
    'post_base_connectors': {'size': '1/2" x 6"', 'quantity_per': 4},  # bolts per connector
    'ledger_locks': {'size': '1/4" x 3"', 'quantity_per': 2}  # lags per lock
}

def calculate_deck_boards(length_ft, width_ft):
    """Calculate the number of deck boards needed."""
    length_in = length_ft * 12  # Convert to inches
    width_in = width_ft * 12
    
    # Calculate number of boards needed (accounting for 1/4" gap between boards)
    gap = 0.25
    effective_board_width = BOARD_WIDTH + gap
    num_boards = ceil(width_in / effective_board_width)
    
    # Calculate linear feet of decking needed
    linear_feet = num_boards * length_ft
    
    # Add 10% for waste
    linear_feet_with_waste = linear_feet * 1.1
    
    # Since boards typically come in 8, 10, 12, 16, 20 ft lengths
    # We'll calculate how many boards are needed based on standard lengths
    standard_lengths = [8, 10, 12, 16, 20]
    boards_needed = 0
    
    for std_len in sorted(standard_lengths, reverse=True):
        if length_ft <= std_len:
            boards_needed = num_boards
            break
    
    # If deck is longer than standard lengths, we'll need to do multiple runs
    if boards_needed == 0:
        boards_needed = num_boards * ceil(length_ft / max(standard_lengths))
    
    return {
        'count': boards_needed,
        'linear_feet': round(linear_feet_with_waste, 2)
    }

def calculate_joists_and_beams(length_ft, width_ft, use_2x6=False):
    """Calculate the framing members needed."""
    length_in = length_ft * 12
    width_in = width_ft * 12
    
    # Adjust joist spacing based on board size
    joist_spacing = 16 if not use_2x6 else 12  # 16" OC for 2x8, 12" OC for 2x6
    
    # Calculate number of joists
    num_joists = ceil(length_in / joist_spacing) + 1  # +1 for the end joist
    
    # Calculate linear feet of joists
    joist_linear_feet = num_joists * width_ft
    
    # Calculate beams - usually 2 runs for a floating deck
    num_beams = 2  # One at each end
    beam_linear_feet = num_beams * length_ft
    
    # Calculate rim joists
    rim_joist_linear_feet = 2 * width_ft  # Front and back
    
    # Total linear feet of framing lumber
    total_linear_feet = joist_linear_feet + beam_linear_feet + rim_joist_linear_feet
    
    # Add 15% for waste and mistakes
    total_linear_feet_with_waste = total_linear_feet * 1.15
    
    return {
        'joists': num_joists,
        'beams': num_beams,
        'total_linear_feet': round(total_linear_feet_with_waste, 2),
        'joist_spacing': joist_spacing,
        'board_size': '2x6' if use_2x6 else '2x8'
    }

def calculate_fasteners(length_ft, width_ft, framing):
    """Calculate the number of fasteners needed."""
    # Calculate screws for decking
    deck_area = length_ft * width_ft
    screws_needed = int(deck_area * SCREWS_PER_SQFT * 1.1)  # Add 10% for waste
    
    # Calculate joist hangers (one per joist)
    joist_hangers = framing['joists']*2
    
    # Calculate post base connectors (one every 6 feet of beam)
    post_base_connectors = ceil(framing['beams'] * (length_ft / 6))
    
    # Calculate ledger locks (if attached to house, not needed for floating deck)
    # But we'll include them in case it's a ledger-based deck
    ledger_locks = 2  # One every 2 feet of ledger board
    
    return {
        'screws': screws_needed,
        'joist_hangers': joist_hangers,
        'post_base_connectors': post_base_connectors,
        'ledger_locks': ledger_locks
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        length = float(data.get('length', 0))
        width = float(data.get('width', 0))
        
        # Validate inputs
        if length <= 0 or width <= 0:
            return jsonify({'error': 'Length and width must be greater than 0'}), 400
            
        if length > 100 or width > 100:  # Reasonable max size
            return jsonify({'error': 'Maximum dimension is 100 feet'}), 400
        
        # Calculate deck boards
        decking = calculate_deck_boards(length, width)
        
        # Get board size preference
        use_2x6 = data.get('use2x6', False)
        
        # Calculate framing
        framing = calculate_joists_and_beams(length, width, use_2x6)
        
        # Calculate fasteners
        fasteners = calculate_fasteners(length, width, framing)
        
        # Prepare the response
        result = {
            'deck_boards': decking['count'],
            'deck_boards_linear_feet': decking['linear_feet'],
            'base_wood': framing['total_linear_feet'],
            'board_size': framing['board_size'],
            'joist_spacing': framing['joist_spacing'],
            'screws': fasteners['screws'],
            'fasteners': [
                {'name': f"Joist Hangers ({FASTENERS['joist_hangers']['size']})", 'quantity': fasteners['joist_hangers']},
                {'name': f"Post Base Connectors ({FASTENERS['post_base_connectors']['size']})", 'quantity': fasteners['post_base_connectors']},
                {'name': f"Ledger Locks (optional)({FASTENERS['ledger_locks']['size']})", 'quantity': fasteners['ledger_locks']},
                {'name': 'Deck Screws (2.5")', 'quantity': fasteners['screws']}
            ]
        }
        
        return jsonify(result)
        
    except ValueError as ve:
        return jsonify({'error': 'Please enter valid numbers for dimensions'}), 400
    except Exception as e:
        app.logger.error(f"Error in calculation: {str(e)}")
        return jsonify({'error': 'An error occurred during calculation'}), 500

if __name__ == '__main__':
    app.run(debug=True)
