from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

#Load Data
columns = [
    "age", "sex", "cp", "trestbps", "chol",
    "fbs", "restecg", "thalach", "exang",
    "oldpeak", "slope", "ca", "thal", "target"
]
df = pd.read_csv(
    "processed.cleveland.data",
    names=columns
)

#Clean Data
df.replace("?", np.nan, inplace=True)
df = df.apply(pd.to_numeric)
df.dropna(inplace=True)
df["target"] = df["target"].apply(
    lambda x: 1 if x > 0 else 0
)

#Train-Test-Split & Scale
X = df.drop("target", axis=1)
y = df["target"]
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

#Logistic Regression
model = LogisticRegression(max_iter=1000)
model.fit(X_train_scaled, y_train)

#Risk Categorization
def risk_category(prob):
    if prob < 0.30:
        return "Low"
    elif prob < 0.60:
        return "Moderate"
    else:
        return "High"

#Expalin Features
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

#Identify Contributors
def split_contributors(
    patient_df,
    max_primary=3,
    max_secondary=2
):
    coef = model.coef_[0]
    scaled_values = scaler.transform(patient_df)[0]
    impact = np.abs(coef * scaled_values)
    impact_df = pd.DataFrame({
        "feature": patient_df.columns,
        "impact": impact
    }).sort_values(
        by="impact",
        ascending=False
    )
    primary = []
    secondary = []
    for f in impact_df["feature"]:
        value = patient_df.iloc[0][f]
        if (
            f in abnormal_conditions
            and abnormal_conditions[f](value)
        ):
            if (
                f in [
                    "ca",
                    "thal",
                    "oldpeak",
                    "exang"
                ]
                and len(primary) < max_primary
            ):
                primary.append(
                    feature_explanations.get(f, f)
                )
            elif (
                f in [
                    "fbs",
                    "trestbps",
                    "chol"
                ]
                and len(secondary) < max_secondary
            ):
                secondary.append(
                    feature_explanations.get(f, f)
                )
    return primary, secondary

#Required Fields
REQUIRED_FIELDS = [
    "age",
    "sex",
    "cp",
    "trestbps",
    "chol",
    "fbs",
    "restecg",
    "thalach",
    "exang",
    "oldpeak",
    "slope",
    "ca",
    "thal"
]

# Predict Endpoint
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({
            "error": "No JSON data provided."
        }), 400
    missing = [
        field
        for field in REQUIRED_FIELDS
        if field not in data
    ]
    if missing:
        return jsonify({
            "error":
            f"Missing required fields: {missing}"
        }), 400
    try:
        patient = pd.DataFrame([{
            "age": float(data["age"]),
            "sex": int(data["sex"]),
            "cp": int(data["cp"]),
            "trestbps": float(data["trestbps"]),
            "chol": float(data["chol"]),
            "fbs": int(data["fbs"]),
            "restecg": int(data["restecg"]),
            "thalach": float(data["thalach"]),
            "exang": int(data["exang"]),
            "oldpeak": float(data["oldpeak"]),
            "slope": int(data["slope"]),
            "ca": int(data["ca"]),
            "thal": int(data["thal"])
        }])
        patient_scaled = scaler.transform(
            patient
        )
        risk_prob = model.predict_proba(
            patient_scaled
        )[0][1]
        risk_level = risk_category(
            risk_prob
        )
        primary, secondary = (
            split_contributors(patient)
        )
        primary = list(
            dict.fromkeys(primary)
        )
        secondary = list(
            dict.fromkeys(secondary)
        )
        if (
            risk_level == "Low"
            and not primary
        ):
            primary = [
                "No major ischemic abnormalities detected"
            ]
        if risk_level == "High":
            suggested_action = (
                "Consider further cardiovascular evaluation."
            )
        elif risk_level == "Moderate":
            suggested_action = (
                "Monitor risk factors and consider preventive assessment."
            )
        else:
            suggested_action = (
                "Routine follow-up and lifestyle management advised."
            )
        return jsonify({
            "risk_probability":
                round(risk_prob * 100, 2),
            "risk_category":
                risk_level,
            "primary_contributors":
                primary,
            "secondary_contributors":
                secondary,
            "suggested_action":
                suggested_action
        })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

#Run Flask
if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
