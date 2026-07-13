# risk-engine/app/core/earth_engine.py

import os

import ee

from dotenv import load_dotenv

load_dotenv()

EE_PROJECT = os.getenv("EE")

if not EE_PROJECT:
    raise RuntimeError(
        "EE project id not found in environment variables."
    )

_initialized = False


def init_ee():

    global _initialized

    if _initialized:
        return

    try:

        ee.Initialize(project=EE_PROJECT)

    except Exception:

        ee.Authenticate()

        ee.Initialize(project=EE_PROJECT)

    _initialized = True

