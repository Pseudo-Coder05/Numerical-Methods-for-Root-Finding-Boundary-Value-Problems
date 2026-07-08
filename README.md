# Numerical Methods Toolkit

A full-stack web application implementing solutions to four applied numerical analysis problems, built as part of a coursework assignment. The backend performs the actual numerical computation in Python; the frontend (React) provides an interactive interface to run each solver and visualize results in real time.

## Problems Covered

1. **Harshad Numbers** — Finds the first non-Harshad factorial and searches for sequences of consecutive Harshad numbers, using `gmpy2` for exact big-integer arithmetic.
2. **Legendre Polynomials** — Computes coefficients, companion matrix, roots (via eigenvalues), and solves `Ax = b` using LU decomposition, with results refined via Newton-Raphson. Uses `mpmath` for 50-decimal-place precision at polynomial orders up to 100.
3. **Gauss-Legendre Quadrature** — Computes quadrature nodes and weights using the Golub-Welsch algorithm (Jacobi matrix eigendecomposition), cross-verified against the analytical Lagrangian weight formula.
4. **Heat Equation (Boundary Value Problem)** — Solves the nonlinear ODE `f'' + 2ηf' = 0` using finite difference discretization, validated against the analytical solution (the error function, `erf`).

## Tech Stack

- **Backend:** Python, Flask, Flask-CORS, NumPy, SciPy, mpmath, gmpy2
- **Frontend:** React, React Router, Chart.js, Tailwind CSS

## Project Structure
numerical-methods-toolkit/
├── backend/
│   ├── static/
│   │   └── plots/           # generated plot images
│   ├── app.py               # Flask backend with all API endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── App.js           # React frontend (all pages combined)
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
└── README.md
## Running the Project Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      
pip install -r requirements.txt
python app.py
```

The backend will run on `http://127.0.0.1:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000` and communicate with the backend automatically.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/harshad/factorial` | POST | Finds non-Harshad factorials in a given range |
| `/api/harshad/consecutive` | POST | Finds the first sequence of N consecutive Harshad numbers |
| `/api/legendre/solve/<n>` | GET | Solves for roots, companion matrix, and Ax=b for a Legendre polynomial of order n |
| `/api/gauss-quad/calculate/<n>` | GET | Computes Gauss-Legendre quadrature nodes and weights of order n |
| `/api/heat-ode/solve` | POST | Solves the heat equation BVP using finite differences |

## Notes

- All large-number computations use arbitrary-precision libraries (`gmpy2`, `mpmath`) to maintain accuracy at scale.
- Some searches (e.g., consecutive Harshad numbers) can be computationally intensive depending on input range.