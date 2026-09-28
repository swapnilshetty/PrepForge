import requests
from django.conf import settings


# =========================================================
# JUDGE0 LANGUAGE IDS
# =========================================================

LANGUAGE_IDS = {
    "python": 71,
    "java": 62,
    "javascript": 63,
}


# =========================================================
# SUBMIT CODE TO JUDGE0
# =========================================================

def execute_code(
    source_code,
    language,
    stdin="",
    expected_output=None,
):
    """
    Send source code to Judge0 and return the execution result.
    """

    if language not in LANGUAGE_IDS:
        raise ValueError(
            f"Unsupported language: {language}"
        )

    language_id = LANGUAGE_IDS[language]


    payload = {
        "source_code": source_code,
        "language_id": language_id,
        "stdin": stdin,
    }


    if expected_output is not None:
        payload["expected_output"] = expected_output


    response = requests.post(
        f"{settings.JUDGE0_URL}/submissions",
        params={
            "base64_encoded": "false",
            "wait": "true",
        },
        json=payload,
        timeout=30,
    )


    response.raise_for_status()

    return response.json()