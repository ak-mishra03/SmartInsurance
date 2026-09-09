import pytest

from app.services.ndwi import (
    classify_severity,
    get_recommendation,
)


@pytest.mark.parametrize(
    ("flood_percent", "expected"),
    [
        (0, "NONE"),
        (0.99, "NONE"),
        (1, "MINOR"),
        (1.99, "MINOR"),
        (2, "MODERATE"),
        (9.99, "MODERATE"),
        (10, "MAJOR"),
        (24.99, "MAJOR"),
        (25, "SEVERE"),
        (50, "SEVERE"),
    ],
)
def test_classify_severity(
    flood_percent,
    expected,
):
    assert (
        classify_severity(flood_percent)
        == expected
    )
