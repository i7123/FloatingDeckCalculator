Floating Deck Calculator Project Plan
Project Overview
The Floating Deck Calculator is a web-based application that allows users to input the dimensions of a floating deck and receive calculations for:

Total deck boards needed.
Total base wood (joists and frame) required.
Number of screws needed for base construction.
List of fasteners required for base construction.
The application will have a simple HTML/CSS/JavaScript front-end for user input and a Python back-end for calculations, using Flask for lightweight deployment.

Objectives
Create a user-friendly interface for inputting deck dimensions (length and width in feet).
Calculate required materials based on standard deck construction assumptions.
Ensure the application is easy to deploy locally or on a cloud platform.
Keep the codebase simple and maintainable.
Scope
Functional Requirements
Front-End:
Input fields for deck length and width (in feet).
A "Calculate" button to trigger calculations.
Display results for deck boards, base wood, screws, and fasteners.
Responsive design using basic CSS.
Back-End:
Calculate total deck boards based on standard board sizes (e.g., 2x6 boards, 12 ft long).
Calculate base wood (joists and frame) based on standard spacing (e.g., 16-inch joist spacing).
Calculate screws based on joist and frame connections.
Generate a list of fasteners (e.g., joist hangers, brackets).
Expose calculations via a REST API endpoint.
Deployment:
Deployable locally with minimal setup (e.g., Python Flask server).
Optionally deployable to a cloud platform like Heroku or Render.
Non-Functional Requirements
Simplicity: Minimal dependencies and straightforward logic.
Performance: Calculations should complete in under 1 second.
Compatibility: Works on modern browsers (Chrome, Firefox, Safari).
Ease of Deployment: Minimal configuration for local or cloud deployment.
Assumptions
Deck boards are 2x6, 12 ft long, with 0.25-inch gaps.
Joists are 2x6, spaced 16 inches on center.
Frame is constructed with 2x6 boards around the perimeter.
Screws: 3-inch deck screws, with 2 screws per joist-to-frame connection.
Fasteners: Standard joist hangers and corner brackets for base construction.
Deck is rectangular and flat (no multi-level or irregular shapes).
Deliverables
Front-end code (HTML, CSS, JavaScript).
Back-end code (Python with Flask).
Deployment instructions (local and optional cloud deployment).
User guide for interacting with the calculator.
Basic test cases to verify calculations.