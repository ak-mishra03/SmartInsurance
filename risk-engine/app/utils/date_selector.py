# risk-engine/app/utils/date_selector.py

from datetime import date, timedelta


def choose_analysis_dates():

    today = date.today()

    post_end = today

    post_start = today - timedelta(days=7)

    pre_end = post_start - timedelta(days=1)

    pre_start = pre_end - timedelta(days=21)

    return {

        "pre_start":
            str(pre_start),

        "pre_end":
            str(pre_end),

        "post_start":
            str(post_start),

        "post_end":
            str(post_end),

    }


