from flask import Flask, render_template, request

app = Flask(__name__)

# Helper function to build the Python analysis script
def build_script(filetype, filename, var1, type1, var2, type2, options):
    lines = [
        'import pandas as pd',
        'import numpy as np',
        'import seaborn as sns',
        'import matplotlib.pyplot as plt',
        'from scipy import stats',
        'import statsmodels.api as sm',
        '',
        '# Laad je dataset',
    ]
    if filetype == 'csv':
        lines.append(f"df = pd.read_csv('{filename}')  # Pas hier de bestandsnaam aan")
    else:
        lines.append(f"df = pd.read_excel('{filename}')  # Pas hier de bestandsnaam aan")
    lines += [
        f"df['{var1}'] = df['{var1}'].astype('{type1}')  # Pas hier '{var1}' aan naar jouw kolomnaam",
        f"df['{var2}'] = df['{var2}'].astype('{type2}')  # Pas hier '{var2}' aan naar jouw kolomnaam",
        '',
        "contingency = pd.crosstab(df['" + var1 + "'], df['" + var2 + "'])",
        'print(contingency)',
        '',
    ]

    if 'chi2' in options:
        lines += [
            '# Chi-kwadraattest',
            'chi2, p, dof, expected = stats.chi2_contingency(contingency)',
            'print("Chi-square statistic:", chi2)',
            'print("p-value:", p)',
            '',
        ]
    if 'cramers_v' in options:
        lines += [
            '# Bereken Cram\u00e9r\'s V',
            'n = contingency.sum().sum()',
            'phi2 = (chi2 / n)',
            'r, k = contingency.shape',
            'cramers_v = np.sqrt(phi2 / (min(k - 1, r - 1)))',
            'print("Cram\u00e9r\'s V:", cramers_v)',
            '',
        ]
    if 'residuals' in options:
        lines += [
            '# Gestandaardiseerde residuen',
            'residuals = (contingency - expected) / np.sqrt(expected)',
            'print("Gestandaardiseerde residuen:")',
            'print(residuals)',
            '',
        ]
    if 'clustered_bar' in options:
        lines += [
            '# Clustered bar chart',
            "contingency.plot(kind='bar')",
            'plt.xlabel("' + var1 + '")',
            'plt.ylabel("Frequentie")',
            'plt.title("Clustered Bar Chart")',
            'plt.show()',
            '',
        ]
    if 'mosaic' in options:
        lines += [
            '# Mosaic plot',
            'from statsmodels.graphics.mosaicplot import mosaic',
            "mosaic(df, [\'" + var1 + "\', \'" + var2 + "\'])",
            'plt.show()',
            '',
        ]

    return "\n".join(lines)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    filetype = request.form.get('filetype')
    filename = request.form.get('filename')
    var1 = request.form.get('var1')
    type1 = request.form.get('type1')
    var2 = request.form.get('var2')
    type2 = request.form.get('type2')
    options = request.form.getlist('options')

    script = build_script(filetype, filename, var1, type1, var2, type2, options)

    # Schrijf requirements.txt
    with open('requirements.txt', 'w') as f:
        f.write('\n'.join([
            'Flask',
            'pandas',
            'scipy',
            'numpy',
            'seaborn',
            'matplotlib',
            'statsmodels',
        ]))

    return render_template('result.html', script=script)

if __name__ == '__main__':
    app.run(debug=True)

