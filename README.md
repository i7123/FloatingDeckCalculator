# Floating Deck Calculator

A web-based application that calculates the materials needed for building a floating deck, including deck boards, base wood, screws, and fasteners.

## 🚀 Features

- **Material Calculation**: Automatically calculates the number of deck boards, framing lumber, and fasteners needed
- **Responsive Design**: Works on desktop and mobile devices
- **User-Friendly Interface**: Simple and intuitive form for entering deck dimensions
- **Detailed Results**: Displays a comprehensive list of materials with quantities
- **Print-Friendly**: Easy to print material lists for shopping

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/deck-calculator.git
   cd deck-calculator
   ```

2. **Create and activate a virtual environment**:
   - On macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   - On Windows:
     ```cmd
     python -m venv venv
     venv\Scripts\activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## 🚀 Usage

1. **Start the development server**:
   ```bash
   flask run
   ```

2. **Open your web browser** and navigate to:
   ```
   http://127.0.0.1:5000
   ```

3. **Enter your deck dimensions** (length and width in feet)

4. **Click "Calculate Materials"** to see the results

## 📊 Calculation Details

The calculator uses the following assumptions:

- **Deck Boards**: 5/4" x 6" x 12' (actual size: 1" x 5.5" x 12')
- **Joist Spacing**: 16" on center
- **Framing**: 2x8 lumber for joists and beams
- **Screws**: 2 screws per square foot of decking
- **Waste Factor**: 
  - Decking: 10%
  - Framing: 15%

## 📁 Project Structure

```
DeckCalculator/
├── app.py                # Main Flask application
├── requirements.txt      # Python dependencies
├── .flaskenv            # Flask environment variables
├── .gitignore           # Git ignore file
├── README.md            # This file
├── static/              # Static files (CSS, JS, images)
│   ├── css/
│   │   └── style.css   # Custom styles
│   └── js/
│       └── main.js     # Client-side JavaScript
└── templates/           # HTML templates
    ├── base.html       # Base template
    └── index.html      # Main page
```

## 🧪 Testing

To run the unit tests:

```bash
python -m pytest tests/
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Flask](https://flask.palletsprojects.com/) - The web framework used
- [Bootstrap 5](https://getbootstrap.com/) - For responsive design
- [Font Awesome](https://fontawesome.com/) - For icons (if used)
