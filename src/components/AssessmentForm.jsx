import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Heart,
  Activity,
  ScanHeart,
  Stethoscope,
} from "lucide-react";
import InputField from "./InputField";
import SectionCard from "./SectionCard";
function AssessmentForm({ onBack }) {
  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    const requiredFields = [
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
      "thal",
    ];
    const hasEmptyField = requiredFields.some(
      (field) => formData[field] === ""
    );
    if (hasEmptyField) {
      setError("Please complete all assessment fields.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data?.error || "Prediction request failed."
        );
      }
      setResult(data);
    } catch (err) {
      setError(
        "Unable to connect to the prediction service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white">
              Cardiovascular Risk Assessment
            </h1>

            <p className="mt-2 text-slate-400">
              Complete the clinical inputs below. Risk prediction
              functionality will be connected to the backend later.
            </p>
          </div>

          <button
            onClick={onBack}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 transition hover:border-cyan-500 hover:bg-slate-800"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
        
          {/* Demographics&Symptoms*/}
          <SectionCard
            title="Demographics & Symptoms"
            subtitle="Basic patient characteristics and symptom profile"
            icon={User}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) =>
                  handleChange("age", e.target.value)
                }
                placeholder="e.g. 54"
                acceptedRange="29–77 years"
              />

              <InputField
                label="Sex"
                type="select"
                value={formData.sex}
                onChange={(e) =>
                  handleChange("sex", e.target.value)
                }
                acceptedRange="Select one"
                options={[
                  {
                    value: "",
                    label: "Select Sex",
                  },
                  {
                    value: "1",
                    label: "Male",
                  },
                  {
                    value: "0",
                    label: "Female",
                  },
                ]}
              />
              <InputField
                label="Chest Pain Type (cp)"
                type="select"
                value={formData.cp}
                onChange={(e) =>
                  handleChange("cp", e.target.value)
                }
                acceptedRange="0–3"
                options={[
                  {
                    value: "",
                    label: "Select Chest Pain Type",
                  },
                  {
                    value: "0",
                    label: "0 - Typical Angina",
                  },
                  {
                    value: "1",
                    label: "1 - Atypical Angina",
                  },
                  {
                    value: "2",
                    label: "2 - Non-anginal Pain",
                  },
                  {
                    value: "3",
                    label: "3 - Asymptomatic",
                  },
                ]}
              />
            </div>
          </SectionCard>
          
          {/* Vital Signs & Metabolic Indicators */}
          <SectionCard
            title="Vital Signs & Metabolic Indicators"
            subtitle="Hemodynamic and biochemical parameters"
            icon={Heart}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Resting Blood Pressure (trestbps)"
                type="number"
                value={formData.trestbps}
                onChange={(e) =>
                  handleChange("trestbps", e.target.value)
                }
                placeholder="e.g. 130"
                acceptedRange="94–200 mm Hg"
              />
              <InputField
                label="Serum Cholesterol (chol)"
                type="number"
                value={formData.chol}
                onChange={(e) =>
                  handleChange("chol", e.target.value)
                }
                placeholder="e.g. 246"
                acceptedRange="126–564 mg/dL"
              />
              <InputField
                label="Fasting Blood Sugar > 120 mg/dL (fbs)"
                type="select"
                value={formData.fbs}
                onChange={(e) =>
                  handleChange("fbs", e.target.value)
                }
                acceptedRange="0–1"
                options={[
                  {
                    value: "",
                    label: "Select Option",
                  },
                  {
                    value: "0",
                    label: "0 - False",
                  },
                  {
                    value: "1",
                    label: "1 - True",
                  },
                ]}
              />
            </div>
          </SectionCard>
          
          {/* ECG & Exercise Findings */}
          <SectionCard
            title="ECG & Exercise Findings"
            subtitle="Electrocardiographic and exercise stress indicators"
            icon={Activity}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Resting ECG (restecg)"
                type="select"
                value={formData.restecg}
                onChange={(e) =>
                  handleChange("restecg", e.target.value)
                }
                acceptedRange="0–2"
                options={[
                  {
                    value: "",
                    label: "Select ECG Result",
                  },
                  {
                    value: "0",
                    label: "0 - Normal",
                  },
                  {
                    value: "1",
                    label: "1 - ST-T Wave Abnormality",
                  },
                  {
                    value: "2",
                    label: "2 - Left Ventricular Hypertrophy",
                  },
                ]}
              />

              <InputField
                label="Maximum Heart Rate (thalach)"
                type="number"
                value={formData.thalach}
                onChange={(e) =>
                  handleChange("thalach", e.target.value)
                }
                placeholder="e.g. 150"
                acceptedRange="71–202 bpm"
              />

              <InputField
                label="Exercise Induced Angina (exang)"
                type="select"
                value={formData.exang}
                onChange={(e) =>
                  handleChange("exang", e.target.value)
                }
                acceptedRange="0–1"
                options={[
                  {
                    value: "",
                    label: "Select Option",
                  },
                  {
                    value: "0",
                    label: "0 - No",
                  },
                  {
                    value: "1",
                    label: "1 - Yes",
                  },
                ]}
              />

              <InputField
                label="ST Depression Induced by Exercise (oldpeak)"
                type="number"
                value={formData.oldpeak}
                onChange={(e) =>
                  handleChange("oldpeak", e.target.value)
                }
                placeholder="e.g. 1.4"
                acceptedRange="0.0–6.2"
              />
	                <InputField
                label="Slope of Peak Exercise ST Segment (slope)"
                type="select"
                value={formData.slope}
                onChange={(e) =>
                  handleChange("slope", e.target.value)
                }
                acceptedRange="0–2"
                options={[
                  {
                    value: "",
                    label: "Select Slope",
                  },
                  {
                    value: "0",
                    label: "0 - Upsloping",
                  },
                  {
                    value: "1",
                    label: "1 - Flat",
                  },
                  {
                    value: "2",
                    label: "2 - Downsloping",
                  },
                ]}
              />
            </div>
          </SectionCard>

          {/* Imaging & Structural Findings */}
          <SectionCard
            title="Imaging & Structural Findings"
            subtitle="Angiographic and perfusion imaging indicators"
            icon={ScanHeart}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <InputField
                label="Number of Major Vessels (ca)"
                type="select"
                value={formData.ca}
                onChange={(e) =>
                  handleChange("ca", e.target.value)
                }
                acceptedRange="0–3"
                options={[
                  {
                    value: "",
                    label: "Select Number of Vessels",
                  },
                  {
                    value: "0",
                    label: "0 Vessels",
                  },
                  {
                    value: "1",
                    label: "1 Vessel",
                  },
                  {
                    value: "2",
                    label: "2 Vessels",
                  },
                  {
                    value: "3",
                    label: "3 Vessels",
                  },
                ]}
              />

              <InputField
                label="Thalassemia / Thallium Stress Test (thal)"
                type="select"
                value={formData.thal}
                onChange={(e) =>
                  handleChange("thal", e.target.value)
                }
                acceptedRange="1–3"
                options={[
                  {
                    value: "",
                    label: "Select Thal Result",
                  },
                  {
                    value: "1",
                    label: "1 - Normal",
                  },
                  {
                    value: "2",
                    label: "2 - Fixed Defect",
                  },
                  {
                    value: "3",
                    label: "3 - Reversible Defect",
                  },
                ]}
              />
            </div>
          </SectionCard>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <Stethoscope
                  className="mt-1 text-cyan-400"
                  size={22}
                />

                <div>
                  <h3 className="font-semibold text-white">
                    Risk Prediction Module
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Enter patient details and click "Assess Risk" to generate a cardiovascular risk prediction.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-cyan-500 px-8 py-4 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Assessing..." : "Assess Risk"}
              </button>
            </div>
          </motion.div>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-red-900/50 bg-slate-900 p-6"
            >
              <p className="text-sm text-red-300">
                {error}
              </p>
            </motion.div>
          )}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-xl font-semibold text-white">
                Prediction Results
              </h3>

              <div className="mt-6 space-y-5 text-slate-300">
                <div>
                  <p className="font-medium text-white">
                    Risk Probability
                  </p>

                  <p className="mt-1">
                    {Number(
                      result.risk_probability
                    ).toFixed(2)}
                    %
                  </p>
                </div>

                <div>
                  <p className="font-medium text-white">
                    Risk Category
                  </p>

                  <p className="mt-1">
                    {result.risk_category}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-white">
                    Primary Contributors
                  </p>

                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {result.primary_contributors.map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
                {result.secondary_contributors &&
                  result.secondary_contributors.length >
                    0 && (
                    <div>
                      <p className="font-medium text-white">
                        Secondary Contributors
                      </p>

                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {result.secondary_contributors.map(
                          (item, index) => (
                            <li key={index}>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <div>
                  <p className="font-medium text-white">
                    Suggested Action
                  </p>
                  <p className="mt-1">
                    {result.suggested_action}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
export default AssessmentForm;
