#!/usr/bin/env python3
"""
Quick Patient Analysis (0-100)

Computes a simple composite risk score out of 100 for provided patient_data and metrics_data.
This is a heuristic scorer (not the ML disease models) using vitals, lifestyle, and condition flags.
"""
from typing import Dict, Tuple, List


def bp_score(sbp: float, dbp: float) -> Tuple[int, str]:
    if sbp is None or dbp is None:
        return 0, "BP: missing"
    # Based on ACC/AHA categories
    if sbp >= 180 or dbp >= 120:
        return 20, f"Hypertensive crisis (SBP {sbp}, DBP {dbp})"
    if sbp >= 140 or dbp >= 90:
        return 16, f"Stage 2 HTN (SBP {sbp}, DBP {dbp})"
    if (130 <= sbp <= 139) or (80 <= dbp <= 89):
        return 10, f"Stage 1 HTN (SBP {sbp}, DBP {dbp})"
    if (120 <= sbp <= 129) and dbp < 80:
        return 5, f"Elevated (SBP {sbp}, DBP {dbp})"
    return 0, f"Normal (SBP {sbp}, DBP {dbp})"


def hr_score(hr: float) -> Tuple[int, str]:
    if hr is None:
        return 0, "HR: missing"
    if 60 <= hr <= 90:
        return 0, f"HR normal ({hr} bpm)"
    if 50 <= hr < 60 or 91 <= hr <= 100:
        return 4, f"HR borderline ({hr} bpm)"
    if 40 <= hr < 50 or 101 <= hr <= 110:
        return 7, f"HR outside optimal ({hr} bpm)"
    return 10, f"HR concerning ({hr} bpm)"


def sleep_score(hours: float) -> Tuple[int, str]:
    if hours is None:
        return 0, "Sleep: missing"
    if 7 <= hours <= 9:
        return 0, f"Sleep optimal ({hours} h)"
    if hours in (6, 10):
        return 3, f"Sleep slightly off ({hours} h)"
    if hours in (5, 11):
        return 6, f"Sleep suboptimal ({hours} h)"
    return 10, f"Sleep poor ({hours} h)"


def exercise_score(minutes: float) -> Tuple[int, str]:
    if minutes is None:
        return 0, "Exercise: missing"
    if minutes >= 30:
        return 0, f"Exercise good ({minutes} min)"
    if 20 <= minutes < 30:
        return 3, f"Exercise fair ({minutes} min)"
    if 10 <= minutes < 20:
        return 6, f"Exercise low ({minutes} min)"
    return 10, f"Very low exercise ({minutes} min)"


def adherence_score(adherence: float) -> Tuple[int, str]:
    if adherence is None:
        return 0, "Adherence: missing"
    if adherence >= 0.9:
        return 0, f"Excellent adherence ({adherence:.2f})"
    if 0.75 <= adherence < 0.9:
        return 4, f"Good adherence ({adherence:.2f})"
    if 0.5 <= adherence < 0.75:
        return 7, f"Low adherence ({adherence:.2f})"
    return 10, f"Poor adherence ({adherence:.2f})"


def symptom_score(label: str, value: float, max_points: int) -> Tuple[int, str]:
    if value is None:
        return 0, f"{label}: missing"
    # value expected 0-10, map to 0-max_points linearly
    points = int(round((value / 10.0) * max_points))
    return points, f"{label}: {value}/10"


def weight_score(weight: float) -> Tuple[int, str]:
    # Without height/BMI, keep low weight contribution
    if weight is None:
        return 0, "Weight: missing"
    if weight > 100:
        return 5, f"Weight elevated ({weight} kg)"
    if weight > 90:
        return 3, f"Weight slightly elevated ({weight} kg)"
    return 0, f"Weight OK ({weight} kg)"


def conditions_score(p: Dict) -> Tuple[int, List[str]]:
    points = 0
    details = []
    if p.get("has_diabetes"):
        points += 10
        details.append("Diabetes +10")
    if p.get("has_hypertension"):
        points += 8
        details.append("Hypertension +8")
    if p.get("has_heart_disease"):
        points += 12
        details.append("Heart disease +12")
    if points > 25:
        details.append(f"Condition cap applied (from {points} to 25)")
        points = 25
    return points, details


def compute_risk(patient: Dict, metrics: Dict) -> Dict:
    total = 0
    breakdown: List[str] = []

    cond_pts, cond_details = conditions_score(patient)
    total += cond_pts
    breakdown.extend([f"Conditions: {', '.join(cond_details) if cond_details else 'None'} (" + str(cond_pts) + ")"])

    pts, note = bp_score(metrics.get("systolic_bp"), metrics.get("diastolic_bp"))
    total += pts
    breakdown.append(f"Blood Pressure: {note} (+{pts})")

    pts, note = hr_score(metrics.get("heart_rate"))
    total += pts
    breakdown.append(f"Heart Rate: {note} (+{pts})")

    pts, note = weight_score(metrics.get("weight"))
    total += pts
    breakdown.append(f"Weight: {note} (+{pts})")

    pts, note = sleep_score(metrics.get("sleep_hours"))
    total += pts
    breakdown.append(f"Sleep: {note} (+{pts})")

    pts, note = exercise_score(metrics.get("exercise_minutes"))
    total += pts
    breakdown.append(f"Exercise: {note} (+{pts})")

    pts, note = adherence_score(metrics.get("medication_adherence"))
    total += pts
    breakdown.append(f"Medication: {note} (+{pts})")

    pts, note = symptom_score("Fatigue", metrics.get("fatigue_score"), 5)
    total += pts
    breakdown.append(f"{note} (+{pts})")

    pts, note = symptom_score("Pain", metrics.get("pain_score"), 5)
    total += pts
    breakdown.append(f"{note} (+{pts})")

    pts, note = symptom_score("Stress", metrics.get("stress_level"), 10)
    total += pts
    breakdown.append(f"{note} (+{pts})")

    total = max(0, min(100, total))

    if total <= 20:
        category = "Low"
    elif total <= 40:
        category = "Mild"
    elif total <= 60:
        category = "Moderate"
    elif total <= 80:
        category = "High"
    else:
        category = "Very High"

    return {
        "risk_score": total,
        "risk_category": category,
        "breakdown": breakdown
    }


def main():
    cases = [
        {
            "label": "Sarah Lee",
            "patient_data": {
                "email": "sarah.lee@example.com",
                "first_name": "Sarah",
                "last_name": "Lee",
                "age": 47,
                "gender": "F",
                "phone": "+12349876501",
                "has_diabetes": True,
                "has_hypertension": False,
                "has_heart_disease": False
            },
            "metrics": {
                "systolic_bp": 124,
                "diastolic_bp": 82,
                "heart_rate": 82,
                "weight": 85.5,
                "sleep_hours": 6.0,
                "exercise_minutes": 15,
                "medication_adherence": 0.65,
                "fatigue_score": 7,
                "pain_score": 2,
                "stress_level": 6,
                "source": "wearable"
            }
        },
        {
            "label": "Michael Brown",
            "patient_data": {
                "email": "michael.brown@example.com",
                "first_name": "Michael",
                "last_name": "Brown",
                "age": 62,
                "gender": "M",
                "phone": "+19876543210",
                "has_diabetes": True,
                "has_hypertension": True,
                "has_heart_disease": True
            },
            "metrics": {
                "systolic_bp": 158,
                "diastolic_bp": 99,
                "heart_rate": 88,
                "weight": 102.0,
                "sleep_hours": 5.5,
                "exercise_minutes": 10,
                "medication_adherence": 0.70,
                "fatigue_score": 8,
                "pain_score": 5,
                "stress_level": 9,
                "source": "manual"
            }
        },
        {
            "label": "Amrita Singh",
            "patient_data": {
                "email": "amrita.singh@example.com",
                "first_name": "Amrita",
                "last_name": "Singh",
                "age": 56,
                "gender": "F",
                "phone": "+11234567891",
                "has_diabetes": False,
                "has_hypertension": True,
                "has_heart_disease": False
            },
            "metrics": {
                "systolic_bp": 128,
                "diastolic_bp": 78,
                "heart_rate": 70,
                "weight": 68.0,
                "sleep_hours": 7.5,
                "exercise_minutes": 40,
                "medication_adherence": 0.98,
                "fatigue_score": 2,
                "pain_score": 1,
                "stress_level": 4,
                "source": "wearable"
            }
        }
    ]

    print("🧮 Quick Health Risk Analysis (0-100)\n" + "="*60)
    for case in cases:
        label = case["label"]
        res = compute_risk(case["patient_data"], case["metrics"])
        print(f"\nPatient: {label}")
        print(f"Risk Score: {res['risk_score']} / 100 ({res['risk_category']})")
        print("Breakdown:")
        for item in res["breakdown"]:
            print(f"  - {item}")


if __name__ == "__main__":
    main()

