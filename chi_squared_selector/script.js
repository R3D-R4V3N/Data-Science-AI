// JavaScript for determining the appropriate chi-squared method
// Add click listener to button

document.getElementById('computeBtn').addEventListener('click', function() {
  const twoCat = document.getElementById('twoCategorical').checked;
  const oneCatPct = document.getElementById('oneCatPercentages').checked;
  const oneCatExp = document.getElementById('oneCatExposure').checked;
  const oneCatSingle = document.getElementById('oneCatSinglePct').checked;
  const cramers = document.getElementById('computeCramersV').checked;

  const resultDiv = document.getElementById('result');
  let output = "";

  // if nothing selected
  if (!twoCat && !oneCatPct && !oneCatExp && !oneCatSingle) {
    output = "\u26A0\uFE0F Selecteer ten minste één criterium om de methode te bepalen.";
  } else if (
    (twoCat && oneCatPct) ||
    (twoCat && oneCatExp) ||
    (twoCat && oneCatSingle) ||
    (oneCatPct && oneCatExp) ||
    (oneCatPct && oneCatSingle) ||
    (oneCatExp && oneCatSingle)
  ) {
    output = "\u26A0\uFE0F Je hebt meerdere onverenigbare opties aangevinkt. Vink slechts de juiste combinatie aan.";
  } else {
    // single valid option
    if (twoCat) {
      output += "**Aanbevolen Methode:** Chi-Squared Test of Independence\n\n";
      output += "**Formule:**\n";
      output += "χ² = Σ (Oᵢ - Eᵢ)² / Eᵢ  \n";
      output += "waarbij Eᵢ = (rijtotal × coltotal) / n  \n";
      output += "Vrijheidsgraden (df) = (#rijen - 1) × (#kolommen - 1)\n\n";
      output += "**Voorbeeldcode (Python):**\n";
      output += "```python\n";
      output += "import pandas as pd\n";
      output += "from scipy.stats import chi2_contingency\n\n";
      output += "observed = pd.crosstab(df['Variabele1'], df['Variabele2'])\n";
      output += "chi2, p, df, expected = chi2_contingency(observed)\n";
      output += "print(f\"χ² = {chi2:.4f}, p = {p:.4f}, df = {df}\")\n";
      output += "```\n\n";
      if (cramers) {
        output += "**Effectgrootte (Cramér’s V):**\n";
        output += "```python\n";
        output += "import numpy as np\n";
        output += "n = observed.to_numpy().sum()\n";
        output += "k = min(observed.shape)\n";
        output += "cramers_v = np.sqrt(chi2 / (n * (k - 1)))\n";
        output += "print(f\"Cramér’s V = {cramers_v:.3f}\")\n";
        output += "```\n";
      }
    } else if (oneCatPct) {
      output += "**Aanbevolen Methode:** Chi-Squared Goodness-of-Fit Test (Known Percentages)\n\n";
      output += "**Formule:**\n";
      output += "χ² = Σ (Oᵢ - Eᵢ)² / Eᵢ  \n";
      output += "waarbij Eᵢ = πᵢ × n  (πᵢ zijn de bekende percentages)\n";
      output += "Vrijheidsgraden (df) = k - 1 (met k = aantal categorieën)\n\n";
      output += "**Voorbeeldcode (Python):**\n";
      output += "```python\n";
      output += "import numpy as np\n";
      output += "from scipy.stats import chisquare\n\n";
      output += "observed = np.array([O1, O2, O3, ...])\n";
      output += "expected_percentages = np.array([p1, p2, p3, ...])\n";
      output += "expected = expected_percentages * observed.sum()\n";
      output += "chi2_stat, p = chisquare(f_obs=observed, f_exp=expected)\n";
      output += "df = len(observed) - 1\n";
      output += "print(f\"χ² = {chi2_stat:.4f}, p = {p:.4f}, df = {df}\")\n";
      output += "```\n";
    } else if (oneCatExp) {
      output += "**Aanbevolen Methode:** Goodness-of-Fit Test met Exposure (Variant C)\n\n";
      output += "**Stappen:**\n";
      output += "1. Bereken totale exposure: Σ exposureᵢ.\n";
      output += "2. Bereken totaal aantal observaties: Σ observedᵢ.\n";
      output += "3. Eᵢ = (exposureᵢ / Σ exposure) × Σ observed.\n";
      output += "4. χ² = Σ (Oᵢ - Eᵢ)² / Eᵢ.\n";
      output += "   Vrijheidsgraden (df) = k - 1 (k = aantal categorieën).\n\n";
      output += "**Voorbeeldcode (Python):**\n";
      output += "```python\n";
      output += "import pandas as pd\n";
      output += "import numpy as np\n";
      output += "from scipy.stats import chisquare\n\n";
      output += "# Dataframe met kolommen: 'category', 'exposure', 'observed'\n";
      output += "df = pd.DataFrame({\n";
      output += "    'category': ['A','B','C',...],\n";
      output += "    'exposure': [e1, e2, e3, ...],\n";
      output += "    'observed': [O1, O2, O3, ...]\n";
      output += "})\n";
      output += "total_exposure = df['exposure'].sum()\n";
      output += "total_observed = df['observed'].sum()\n";
      output += "df['expected'] = (df['exposure'] / total_exposure) * total_observed\n";
      output += "chi2_stat, p = chisquare(f_obs=df['observed'], f_exp=df['expected'])\n";
      output += "df_chi = len(df) - 1\n";
      output += "print(f\"χ² = {chi2_stat:.4f}, p = {p:.4f}, df = {df_chi}\")\n";
      output += "```\n";
    } else if (oneCatSingle) {
      output += "**Aanbevolen Methode:** 2-Categorie Chi-Squared Goodness-of-Fit / Proportie-Test\n\n";
      output += "**Formule:**\n";
      output += "O = [#success, #fail]  \n";
      output += "E = [p_known × n, (1 - p_known) × n]  \n";
      output += "χ² = Σ (Oᵢ - Eᵢ)² / Eᵢ  (vrijheidsgraden = 1)\n\n";
      output += "**Voorbeeldcode (Python):**\n";
      output += "```python\n";
      output += "import numpy as np\n";
      output += "from scipy.stats import chisquare\n\n";
      output += "success = aantal_cases_in_categorie\n";
      output += "total = totaal_aantal\n";
      output += "expected_proportion = 0.20  # bijvoorbeeld 20%\n";
      output += "observed = np.array([success, total - success])\n";
      output += "expected = np.array([expected_proportion, 1 - expected_proportion]) * total\n";
      output += "chi2_stat, p = chisquare(f_obs=observed, f_exp=expected)\n";
      output += "df = 1\n";
      output += "print(f\"χ² = {chi2_stat:.4f}, p = {p:.4f}, df = {df}\")\n";
      output += "```\n";
    }
  }

  resultDiv.style.display = 'block';
  resultDiv.textContent = output;
});
