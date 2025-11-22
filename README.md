AI Studio — Complete (Frontend + Flask Backend)

Structure:
- frontend/    -> static frontend (index.html, studio.html, assets)
- backend/     -> Flask backend, services (stubs), uploads/results
- README.md    -> instructions

To run locally:
1) Install Python 3.8+
2) cd backend
3) python -m venv venv
4) source venv/bin/activate   (Windows: venv\Scripts\activate)
5) pip install -r requirements.txt
6) python app.py
7) Open http://localhost:3000  (redirects to frontend)

Notes: service scripts under backend/services/ are stubs that copy input->output. Replace with real model code for AI functionality.
