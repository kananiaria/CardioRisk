# ==========================================
# Cardiovascular Risk Stratification Tool
# Screening & Early Referral Support
# ==========================================

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

# ------------------------------------------
# 1. Load Dataset
# ------------------------------------------

columns = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalach", "exang",
    "oldpeak", "slope", "ca", "thal", "target"
]

df = pd.read_csv(
    "processed.cleveland.data",
    names=columns
)

# ------------------------------------------
# 2. Data Cleaning
# ------------------------------------------

df.replace("?", np.nan, inplace=True)
df = df.apply(pd.to_numeric)
df.dropna(inplace=True)

df["target"] = df["target"].apply(lambda x: 1 if x > 0 else 0)

# ------------------------------------------
# 3. Train-Test Split
# ------------------------------------------

X = df.drop("target", axis=1)
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ------------------------------------------
# 4. Scaling
# ------------------------------------------

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# ------------------------------------------
# 5. Model (Explainable)
# ------------------------------------------

model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

# ------------------------------------------
# 6. Risk Categorization
# ------------------------------------------

def risk_category(prob):
    if prob < 0.30:
        return "Low"
    elif prob < 0.60:
        return "Moderate"
    else:
        return "High"

# ------------------------------------------
# 7. Feature Explanations
# ------------------------------------------

feature_explanations = {
    "chol": "High cholesterol",
    "exang": "Exercise-induced angina",
    "oldpeak": "Abnormal ST segment",
    "trestbps": "Elevated resting blood pressure",
    "thalach": "Reduced maximum heart rate",
    "cp": "Chest pain characteristics",
    "ca": "Coronary vessel involvement",
    "thal": "Stress test abnormality",
    "fbs": "Elevated fasting blood glucose"
}

abnormal_conditions = {
    "chol": lambda v: v > 200,
    "trestbps": lambda v: v > 130,
    "oldpeak": lambda v: v > 1.0,
    "exang": lambda v: v == 1,
    "ca": lambda v: v > 0,
    "thal": lambda v: v in [2, 3],
    "fbs": lambda v: v == 1
}

# ------------------------------------------
# 8. Contributor Identification
# ------------------------------------------
'''
def split_contributors(patient_df):
    coef = model.coef_[0]
    scaled_values = scaler.transform(patient_df)[0]
    impact = np.abs(coef * scaled_values)

    impact_df = pd.DataFrame({
        "feature": patient_df.columns,
        "impact": impact
    }).sort_values(by="impact", ascending=False)

    primary = []
    secondary = []

    for f in impact_df["feature"]:
        if f in ["ca", "thal", "exang", "oldpeak"] and len(primary) < 3:
            primary.append(feature_explanations.get(f, f))
        elif f in ["fbs", "trestbps", "chol"] and len(secondary) < 2:
            secondary.append(feature_explanations.get(f, f))
    return primary, secondary
    '''
def split_contributors(patient_df, max_primary=3, max_secondary=2):
    coef = model.coef_[0]
    scaled_values = scaler.transform(patient_df)[0]

    impact = np.abs(coef * scaled_values)

    impact_df = pd.DataFrame({
        "feature": patient_df.columns,
        "impact": impact
    }).sort_values(by="impact", ascending=False)

    primary = []
    secondary = []

    for f in impact_df["feature"]:
        value = patient_df.iloc[0][f]

        # 🔒 ONLY include if the value is clinically abnormal
        if f in abnormal_conditions and abnormal_conditions[f](value):

            # Primary (ischemic / structural)
            if f in ["ca", "thal", "oldpeak", "exang"] and len(primary) < max_primary:
                primary.append(feature_explanations.get(f, f))

            # Secondary (metabolic / BP / lipid)
            elif f in ["fbs", "trestbps", "chol"] and len(secondary) < max_secondary:
                secondary.append(feature_explanations.get(f, f))

    return primary, secondary

# ------------------------------------------
# 9. Take User Input
# ------------------------------------------

def get_user_input():
    print("\nEnter patient clinical details:\n")

    return pd.DataFrame([{
        "age": float(input("Age: ")),
        "sex": int(input("Sex (1 = Male, 0 = Female): ")),
        "cp": int(input("Chest pain type (0–3): ")),
        "trestbps": float(input("Resting blood pressure (mm Hg): ")),
        "chol": float(input("Serum cholesterol (mg/dl): ")),
        "fbs": int(input("Fasting blood sugar > 120 mg/dl (1 = Yes, 0 = No): ")),
        "restecg": int(input("Resting ECG result (0–2): ")),
        "thalach": float(input("Maximum heart rate achieved: ")),
        "exang": int(input("Exercise-induced angina (1 = Yes, 0 = No): ")),
        "oldpeak": float(input("ST depression induced by exercise: ")),
        "slope": int(input("Slope of peak exercise ST segment (0–2): ")),
        "ca": int(input("Number of major vessels (0–3): ")),
        "thal": int(input("Thalassemia (1 = Normal, 2 = Fixed, 3 = Reversible): "))
    }])

# ------------------------------------------
# 10. Run Assessment
# ------------------------------------------

patient = get_user_input()
patient_scaled = scaler.transform(patient)

risk_prob = model.predict_proba(patient_scaled)[0][1]
risk_pct = int(risk_prob * 100)
risk_level = risk_category(risk_prob)

primary, secondary = split_contributors(patient)
primary = list(dict.fromkeys(primary))
secondary = list(dict.fromkeys(secondary))
if risk_level == "Low" and not primary:
    primary = ["No major ischemic abnormalities detected"]

# ------------------------------------------
# 11. Final Output
# ------------------------------------------

print("\n--------------------------------")

print("\nCARDIOVASCULAR RISK ASSESSMENT\n")
print(f"Risk Probability: {risk_pct}%")
print(f"Risk Category: {risk_level}\n")

print("Primary Contributors:")
for p in primary:
    print(f"- {p}")

if secondary:
    print("\nSecondary Risk Indicators:")
    for s in secondary:
        print(f"- {s}")

print("\nSuggested Action:")
if risk_level == "High":
    print("Consider further cardiovascular evaluation.")
elif risk_level == "Moderate":
    print("Monitor risk factors and consider preventive assessment.")
else:
    print("Routine follow-up and lifestyle management advised.")

print("\n⚠ Screening support only — not diagnostic.")

print("--------------------------------")

