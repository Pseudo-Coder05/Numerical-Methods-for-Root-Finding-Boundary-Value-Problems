

# //combined everything
import math
import gmpy2
import numpy as np
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from scipy.special import legendre, eval_legendre, roots_legendre, erf
from scipy.linalg import eig, lu, lu_solve, lu_factor
from scipy.optimize import newton
import time
import json
import sys
import logging
import mpmath # Import mpmath for high precision

# --- App Initialization ---
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# Set high precision for mpmath (50 decimal places)
mpmath.mp.dps = 50

# ================================================
# --- Utility Formatters (for mpmath) ---
# ================================================

def format_matrix_mp(matrix):
    """Converts an mpmath matrix to a list of lists of strings."""
    rows, cols = matrix.rows, matrix.cols
    
    # Smart truncation for very large matrices
    # Display full matrix for n <= 20, truncate for n > 20
    MAX_DISPLAY_N = 20
    if rows > MAX_DISPLAY_N:
        return f"Matrix is {rows}x{cols}. Display omitted for performance."

    formatted = []
    for r in range(rows):
        # Format each value to 8 decimal places as a string
        formatted.append([f"{mpmath.nstr(val, 8)}" for val in matrix.tolist()[r]])
    return formatted

def format_vector_mp(vector):
    """Converts an mpmath vector or list to a list of strings."""
    list_vec = []
    if hasattr(vector, 'tolist'):
        list_vec = vector.tolist()
        if len(list_vec) == 1:
            list_vec = list_vec[0]
        elif len(list_vec) > 1 and len(list_vec[0]) == 1:  # Column vector
            list_vec = [row[0] for row in list_vec]
    else:
        list_vec = list(vector)

    formatted = []
    for val in list_vec:
        # Handle complex numbers if they appear
        if hasattr(val, 'imag') and val.imag != 0:
            formatted.append(f"{mpmath.nstr(val.real, 8)} + {mpmath.nstr(val.imag, 8)}j")
        else:
            val_real = val.real if hasattr(val, 'real') else val
            formatted.append(f"{mpmath.nstr(val_real, 8)}")
    
    return formatted

# ================================================
# --- Utility Formatters (for numpy) ---
# ================================================

def format_matrix_np(matrix, n=10):
    """Safely formats a numpy matrix for display, slicing if too large."""
    if matrix.shape[0] > n:
        # Create a representation of the truncated matrix
        formatted = []
        # Top-left n x n block
        for r in range(n):
            formatted.append([f"{matrix[r, c]:.4f}" for c in range(n)] + ["..."])
        # Add a row of ellipses
        formatted.append(["..."] * (n + 1))
        return formatted
    
    return [[f"{val:.4f}" for val in row] for row in matrix]

def format_vector_np(vector, n=100):
    """Safely formats a numpy vector for display, slicing if too large."""
    # Ensure vector is 1D
    if vector.ndim > 1:
        vector = vector.flatten()
        
    formatted = []
    for val in vector:
        if np.iscomplex(val):
            formatted.append(f"{val.real:.8f} + {val.imag:.8f}j")
        else:
            formatted.append(f"{val.real:.8f}")
            
    if len(formatted) > n:
        return formatted[:n] + [f"... ({len(formatted) - n} more)"]
    return formatted


# ================================================
# --- Assignment 1: Harshad Numbers ---
# ================================================

def sum_digits(n_str):
    """Calculates the sum of digits of a number given as a string."""
    return sum(int(digit) for digit in n_str)

def is_harshad(n):
    """Checks if a number is a Harshad number using gmpy2."""
    if n == 0:
        return False
    n_str = str(n)
    s = sum_digits(n_str)
    if s == 0:
        return False
    return gmpy2.is_divisible(int(n), s)

@app.route('/api/harshad/factorial', methods=['POST'])
def find_factorial_harshad_in_range():
    """Finds non-Harshad factorials in a range."""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid request: No JSON body provided."}), 400
    try:
        start_n = int(data.get('start', 1))
        end_n = int(data.get('end', 1))
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid input: 'start' and 'end' must be integers."}), 400

    MAX_RANGE_SIZE = 500
    MAX_N_VALUE = 10000
    if not (1 <= start_n <= end_n and (end_n - start_n + 1) <= MAX_RANGE_SIZE and end_n <= MAX_N_VALUE):
        return jsonify({"message": f"Invalid range. Max range {MAX_RANGE_SIZE}, max end {MAX_N_VALUE}."}), 400

    not_harshad_factorials = []
    for n in range(start_n, end_n + 1):
        fact = gmpy2.fac(n)
        fact_str = str(fact)
        digit_sum = sum_digits(fact_str)
        if digit_sum == 0: continue
        is_divisible = gmpy2.is_divisible(fact, digit_sum)
        
        if not is_divisible:
            integer_part = fact // digit_sum
            remainder = fact % digit_sum
            # Calculate 8 decimal places for the division result
            decimal_part_numerator = remainder * (10**8)
            decimal_part = decimal_part_numerator // digit_sum
            division_result_str = f"{integer_part}.{decimal_part:08d}"

            truncated_division_str = division_result_str[:30] + "..." if len(division_result_str) > 30 else division_result_str
            truncated_fact_str = fact_str[:15] + "..." + fact_str[-15:] if len(fact_str) > 30 else fact_str

            not_harshad_factorials.append({
                "n": n, "factorial_str": truncated_fact_str, "digits": len(fact_str),
                "digit_sum": int(digit_sum), "division_result_str": truncated_division_str
            })
    
    if not_harshad_factorials:
        return jsonify({"status": "found", "results": not_harshad_factorials})
    else:
        return jsonify({"status": "none_found", "message": f"No non-Harshad factorials found in the range n={start_n} to n={end_n}."})

@app.route('/api/harshad/consecutive', methods=['POST'])
def find_consecutive_harshad():
    """Finds the first sequence of N consecutive Harshad numbers."""
    data = request.get_json()
    try:
        start_n_str = data.get('start', '1')
        start_n = int(start_n_str)
        n_consecutive = int(data.get('n', 10))
    except (ValueError, TypeError):
        return jsonify({"status": "error", "message": "Invalid 'start' or 'n' number."}), 400

    if not 1 <= n_consecutive <= 20:
        return jsonify({"status": "error", "message": "N (consecutive count) must be between 1 and 20."}), 400

    # Increase search limit for potentially large start numbers
    search_limit = 1_000_000
    n = start_n
    
    # Check if the user-provided start number is the beginning of a sequence
    if all(is_harshad(n + i) for i in range(n_consecutive)):
        return jsonify({"status": "found", "first_number": str(n), "count": n_consecutive})
    
    # If not, search forwards from that number
    n += 1 # Start searching from the next number
    for _ in range(search_limit):
        if all(is_harshad(n + i) for i in range(n_consecutive)):
            return jsonify({"status": "found", "first_number": str(n), "count": n_consecutive})
        n += 1
        
    return jsonify({"status": "not_found", "message": f"No sequence of {n_consecutive} found after checking {search_limit} numbers from {start_n_str}."}), 404

# ================================================
# --- Assignment 2: Legendre Polynomials ---
# ================================================
@app.route('/api/legendre/solve/<int:n>', methods=['GET'])
def solve_polynomial_problem(n):
    """
    Performs all requested calculations for a polynomial of order 'n'
    using high-precision mpmath library.
    """
    if not 3 <= n <= 100:
        return jsonify({"error": "Order 'n' must be between 3 and 100 for stability."}), 400

    try:
        # --- Part 1: Determine the roots (Eigenvalues) ---
        # Use SciPy's stable `roots_legendre` as it's fast and accurate
        # We convert them to mpmath objects for high-precision calculations
        try:
            nodes_np, weights_np = roots_legendre(n)
            roots_mp = [mpmath.mpf(x) for x in nodes_np]
            roots_mp.sort(key=lambda x: (x.real, x.imag))
        except Exception:
            # Fallback to high-precision Jacobi matrix (still stable)
            J = mpmath.matrix(n)
            for i in range(n - 1):
                val = mpmath.mpf(i + 1) / mpmath.sqrt(4 * (i + 1)**2 - 1)
                J[i, i + 1] = val
                J[i + 1, i] = val
            eigenvalues_matrix = mpmath.eigsy(J)[0]
            roots_list = eigenvalues_matrix.tolist()
            if len(roots_list) == 1:
                roots_list = roots_list[0]
            elif len(roots_list) > 1 and len(roots_list[0]) == 1:
                roots_list = [row[0] for row in roots_list]
            roots_list.sort(key=lambda x: (x.real, x.imag))
            roots_mp = [mpmath.mpf(r) for r in roots_list]

        # --- Part 2: Determine the polynomial ---
        # Build the *monic* polynomial (leading coeff = 1) from the roots.
        monic_coeffs = [mpmath.mpf(0)] * (n + 1)
        monic_coeffs[0] = mpmath.mpf(1)
        for root in roots_mp:
            for i in range(len(monic_coeffs) - 1, 0, -1):
                monic_coeffs[i] = monic_coeffs[i] - root * monic_coeffs[i - 1]

        # Compute *standard* Legendre polynomial coeffs for output
        const_cn = mpmath.fac(2 * n) / (mpmath.power(2, n) * mpmath.fac(n)**2)
        coeffs_mp = [c * const_cn for c in monic_coeffs]

        # --- Part 3: Determine the companion matrix (A) ---
        A = mpmath.matrix(n)
        for i in range(n - 1):
            A[i + 1, i] = 1
        for i in range(n):
            # C = [-c_{n-1}, -c_{n-2}, ..., -c_0]
            # monic_coeffs = [c_n, c_{n-1}, ..., c_0] where c_n=1
            A[i, n - 1] = -monic_coeffs[n - i]

        # --- Part 4: Solve Ax=b using LU decomposition ---
        L, U, P = mpmath.lu(A)
        b_vec = mpmath.matrix([i for i in range(1, n + 1)])
        x_solution = mpmath.lu_solve(A, b_vec)

        # --- Part 5: Newton-Raphson for smallest/largest roots ---
        def legendre_func_mp(x):
            return mpmath.legendre(n, x)
        
        root_smallest = mpmath.findroot(legendre_func_mp, -1.0 + 1e-10)
        root_largest = mpmath.findroot(legendre_func_mp, 1.0 - 1e-10)

        # --- Part 6: Prepare Results ---
        # All formatting functions will return full, un-truncated data
        # or a placeholder string if n is too large.
        return jsonify({
            "A_Polynomial": {
                "description": f"Coefficients of the standard Legendre Polynomial P_{n}(x) of order {n}. The list is [c_{n}, c_{n-1}, ..., c_0].",
                "order": n,
                "coefficients": format_vector_mp(coeffs_mp)
            },
            "B_Companion_Matrix": {
                "description": f"Companion matrix 'A' (size {n}x{n}) for the monic polynomial.",
                "matrix_A": format_matrix_mp(A)
            },
            "C_Roots_Eigenvalues": {
                "description": f"The {n} roots of the polynomial, which are the eigenvalues of the companion matrix 'A', found using a stable algorithm.",
                "roots": format_vector_mp(roots_mp)
            },
            "D_LU_Decomposition_Solve": {
                "description": "Solution to Ax=b using LU decomposition, where b = [1, 2, ..., n].",
                "P_matrix (Permutation)": format_matrix_mp(P),
                "L_matrix (Lower)": format_matrix_mp(L),
                "U_matrix (Upper)": format_matrix_mp(U),
                "b_vector": format_vector_mp(b_vec),
                "x_solution_vector": format_vector_mp(x_solution)
            },
            "E_Newton_Raphson_Roots": {
                "description": "Smallest and largest roots found using mpmath's high-precision Newton-Raphson-based solver.",
                "smallest_root": f"{mpmath.nstr(root_smallest, 12)}",
                "largest_root": f"{mpmath.nstr(root_largest, 12)}"
            }
        })

    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


# ================================================
# --- Assignment 3: Gaussian Quadrature ---
# ================================================
@app.route('/api/gauss-quad/calculate/<int:n>', methods=['GET'])
def solve_gaussian_quadrature(n):
    """
    Performs all requested calculations for Gauss-Legendre quadrature
    using standard numpy precision.
    """
    if not 3 <= n <= 64:
        return jsonify({"error": "Order 'n' must be between 3 and 64."}), 400

    try:
        start_time = time.time()
        
        # --- 1. Construct Jacobi Matrix (for Gauss-Legendre) ---
        J = np.zeros((n, n))
        for i in range(n - 1):
            val = (i + 1) / np.sqrt(4 * (i + 1)**2 - 1)
            J[i, i + 1] = val
            J[i + 1, i] = val
        
        # --- 2. Golub-Welsch: Eigenvalues (Nodes) & Eigenvectors (for Weights) ---
        # Use `eigh` for symmetric matrices, guaranteeing real eigenvalues
        # and orthogonal eigenvectors.
        eigenvalues, eigenvectors = np.linalg.eigh(J)
        
        nodes_gw = eigenvalues
        # Weights w_i = 2 * (v_i,1)^2, where v_i,1 is the first component
        # of the i-th normalized eigenvector.
        weights_gw = 2 * (eigenvectors[0, :])**2
        
        # Sort by node value for consistency
        sort_indices = np.argsort(nodes_gw)
        nodes_gw = nodes_gw[sort_indices]
        weights_gw = weights_gw[sort_indices]

        # --- 3. Lagrangian Weights (Verification) ---
        P_n = legendre(n)
        P_n_prime = P_n.deriv(1)
        
        weights_lagrange = []
        for x_i in nodes_gw:
            P_n_prime_val = P_n_prime(x_i)
            w_i = 2 / ((1 - x_i**2) * (P_n_prime_val**2))
            weights_lagrange.append(w_i)
        weights_lagrange = np.array(weights_lagrange)

        # --- 4. Plotting Data ---
        plot_data = [{"x": float(x), "y": float(w)} for x, w in zip(nodes_gw, weights_gw)]

        # --- 5. Orthogonal Collocation Matrices (A & B) ---
        A_matrix = np.zeros((n, n))
        B_matrix = np.diag(weights_gw) # B is just the diagonal matrix of weights
        
        P_n_prime_at_nodes = np.array([P_n_prime(x) for x in nodes_gw])
        
        for i in range(n):
            x_i = nodes_gw[i]
            for j in range(n):
                x_j = nodes_gw[j]
                if i != j:
                    A_matrix[i, j] = P_n_prime_at_nodes[i] / (P_n_prime_at_nodes[j] * (x_i - x_j))
                else:
                    # Handle potential division by zero at x_i = +/- 1 (though roots of P_n(x) are strictly in (-1, 1))
                    if 1 - x_i**2 == 0:
                        A_matrix[i, i] = 0 # Or handle as appropriate
                    else:
                        A_matrix[i, i] = -x_i / (2 * (1 - x_i**2))

        # --- Format and Return ---
        computation_time = time.time() - start_time
        
        display_n = 10 # Truncate matrices larger than 10x10
        
        return jsonify({
            "order": n,
            "computation_time": f"{computation_time:.4f}s",
            "nodes": format_vector_np(nodes_gw),
            "weights_golub_welsch": format_vector_np(weights_gw),
            "weights_lagrange": format_vector_np(weights_lagrange),
            "plot_data": plot_data,
            "collocation_A": format_matrix_np(A_matrix, n=display_n),
            "collocation_B": format_matrix_np(B_matrix, n=display_n),
        })

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# ================================================
# --- Assignment 4: Heat Equation ODE ---
# ================================================
@app.route('/api/heat-ode/solve', methods=['POST'])
def solve_heat_ode():
    """
    Solves the BVP f'' + 2*eta*f' = 0 using Finite Difference Method.
    """
    data = request.get_json()
    try:
        n = int(data.get('n', 32))
        eta_max = float(data.get('eta_max', 6.0))
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid input: 'n' and 'eta_max' must be numbers."}), 400

    if not 10 <= n <= 200 or not 2.0 <= eta_max <= 10.0:
        return jsonify({"error": "Invalid range. n must be 10-200, eta_max must be 2.0-10.0."}), 400

    try:
        # --- 1. Discretize the Domain ---
        nodes_eta = np.linspace(0, eta_max, n)
        h = nodes_eta[1] - nodes_eta[0] # Step size

        # --- 2. Construct the Linear System Af = b ---
        A = np.zeros((n, n))
        b = np.zeros(n)

        # --- 3. Set Boundary Conditions ---
        # f(0) = 0
        A[0, 0] = 1.0
        b[0] = 0.0
        
        # f(eta_max) = erf(eta_max) 
        # --- FIX: Changed from erf(eta_max / 2) ---
        A[n - 1, n - 1] = 1.0
        b[n - 1] = erf(eta_max) 
        # --- END FIX ---

        # --- 4. Populate Interior Points (FDM) ---
        # f'' + 2*eta*f' = 0
        # (f_{i+1} - 2f_i + f_{i-1}) / h^2 + 2*eta_i * (f_{i+1} - f_{i-1}) / (2h) = 0
        # Grouping terms:
        # f_{i-1} * (1/h^2 - eta_i/h)
        # f_i     * (-2/h^2)
        # f_{i+1} * (1/h^2 + eta_i/h)
        
        for i in range(1, n - 1):
            eta_i = nodes_eta[i]
            
            coeff_minus_1 = (1 / h**2) - (eta_i / h)
            coeff_0 = -2 / h**2
            coeff_plus_1 = (1 / h**2) + (eta_i / h)
            
            A[i, i - 1] = coeff_minus_1
            A[i, i] = coeff_0
            A[i, i + 1] = coeff_plus_1
            
            b[i] = 0.0 # Right-hand side is 0
            
        # --- 5. Solve the System ---
        f_numerical = np.linalg.solve(A, b)
        
        # --- 6. Calculate Analytical Solution for Comparison ---
        # --- FIX: Changed from erf(nodes_eta / 2) ---
        f_analytical = erf(nodes_eta)
        # --- END FIX ---

        # --- 7. Format and Return Results ---
        return jsonify({
            "nodes_eta": [f"{v:.4f}" for v in nodes_eta],
            "f_numerical": [f"{v:.4f}" for v in f_numerical],
            "f_analytical": [f"{v:.4f}" for v in f_analytical],
            "plot_data": [
                {"x": float(eta), "y_num": float(f_num), "y_ana": float(f_ana)}
                for eta, f_num, f_ana in zip(nodes_eta, f_numerical, f_analytical)
            ]
        })

    except Exception as e:
        logging.error(f"Error in solve_heat_ode: {str(e)}")
        return jsonify({"error": f"An error occurred during calculation: {str(e)}"}), 500


# --- Main Execution ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)