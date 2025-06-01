import unittest
from app import app, calculate_deck_boards, calculate_joists_and_beams, calculate_fasteners, FASTENERS

class TestDeckCalculator(unittest.TestCase):
    def setUp(self):
        """Set up test client before each test."""
        app.config['TESTING'] = True
        self.client = app.test_client()

    # Test calculate_deck_boards function
    def test_calculate_deck_boards(self):
        # Test with minimum dimensions (1ft x 1ft)
        # 12" / (5.5" + 0.25") = 12 / 5.75 = 2.09 -> 3 boards
        # Linear feet = 3 * 1ft * 1.1 (10% waste) = 3.3
        result = calculate_deck_boards(1, 1)
        self.assertEqual(result['count'], 3)
        self.assertAlmostEqual(result['linear_feet'], 3.3, places=1)
        
        # Test with standard deck size (12ft x 12ft)
        # Width: 144" / 5.75" = ~25.04 -> 26 boards
        # Linear feet = 26 * 12ft * 1.1 = 343.2
        result = calculate_deck_boards(12, 12)
        self.assertEqual(result['count'], 26)
        self.assertAlmostEqual(result['linear_feet'], 343.2, places=1)

    # Test calculate_joists_and_beams function
    def test_calculate_joists_and_beams(self):
        # Test with 2x8 boards (default)
        result = calculate_joists_and_beams(12, 12)
        self.assertEqual(result['board_size'], '2x8')
        self.assertEqual(result['joist_spacing'], 16)
        self.assertGreater(result['joists'], 8)  # At least 8 joists for 12ft at 16" OC
        self.assertEqual(result['beams'], 2)

        # Test with 2x6 boards
        result = calculate_joists_and_beams(12, 12, use_2x6=True)
        self.assertEqual(result['board_size'], '2x6')
        self.assertEqual(result['joist_spacing'], 12)  # 12" OC for 2x6
        self.assertGreater(result['joists'], 11)  # More joists for 12" OC

    # Test calculate_fasteners function
    def test_calculate_fasteners(self):
        # Create a sample framing result
        framing = {
            'joists': 10,
            'beams': 2,
            'total_linear_feet': 100
        }
        
        result = calculate_fasteners(12, 12, framing)
        
        # Test joist hangers (2 per joist)
        self.assertEqual(result['joist_hangers'], 20)  # 10 joists * 2
        
        # Test post base connectors (1 every 6 feet)
        self.assertEqual(result['post_base_connectors'], 4)  # 12ft / 6ft * 2 beams
        
        # Test screws (2 per sqft with 10% waste)
        self.assertAlmostEqual(result['screws'], 12 * 12 * 2 * 1.1, delta=10)

    # Test API endpoints
    def test_calculate_endpoint(self):
        # Test with valid data
        response = self.client.post('/calculate', 
                                  json={'length': 12, 'width': 12, 'use2x6': False})
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('deck_boards', data)
        self.assertIn('base_wood', data)
        self.assertIn('screws', data)
        self.assertIn('fasteners', data)

        # Test with invalid data
        response = self.client.post('/calculate', 
                                  json={'length': 0, 'width': 0})
        self.assertEqual(response.status_code, 400)

    def test_index_route(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Floating Deck Calculator', response.data)

if __name__ == '__main__':
    unittest.main()
