"""
Temporal / Bid-Date Validation Service
e-BID PRAMAAN — CPCL
Validates statutory and quality certificates against the statutory Bid Cut-off Date:
valid_from <= bid_cutoff_date <= valid_until
"""

from datetime import datetime, date
from typing import Optional, Dict, Any
import re

DATE_FORMATS = [
    "%Y-%m-%d",
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%Y/%m/%d",
    "%d-%b-%Y",
    "%d %b %Y",
    "%d-%B-%Y"
]

def parse_date_flexible(date_str: Optional[str]) -> Optional[date]:
    """Parses various date string formats safely."""
    if not date_str:
        return None
    
    clean_str = date_str.strip()
    # Remove ISO time if present
    if "T" in clean_str:
        clean_str = clean_str.split("T")[0]
    elif " " in clean_str:
        clean_str = clean_str.split(" ")[0]

    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(clean_str, fmt).date()
        except ValueError:
            continue

    # Try regex fallback for DD-MM-YYYY or YYYY-MM-DD
    m = re.search(r"(\d{4})[-/](\d{1,2})[-/](\d{1,2})", clean_str)
    if m:
        try:
            return date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        except ValueError:
            pass

    m2 = re.search(r"(\d{1,2})[-/](\d{1,2})[-/](\d{4})", clean_str)
    if m2:
        try:
            return date(int(m2.group(3)), int(m2.group(2)), int(m2.group(1)))
        except ValueError:
            pass

    return None

class TemporalValidationService:
    @classmethod
    def validate_bid_date_compliance(
        cls,
        valid_until_str: str,
        bid_cutoff_str: str,
        valid_from_str: Optional[str] = None,
        doc_name: str = "Certificate"
    ) -> Dict[str, Any]:
        """
        Validates whether a document was active and legally valid on the statutory bid cutoff date.
        """
        expiry_date = parse_date_flexible(valid_until_str)
        bid_date = parse_date_flexible(bid_cutoff_str)
        start_date = parse_date_flexible(valid_from_str) if valid_from_str else None

        if not expiry_date or not bid_date:
            return {
                "status": "MANUAL REVIEW REQUIRED",
                "isValidOnBidDate": False,
                "daysRemainingOrOverdue": 0,
                "message": f"Could not parse valid date tokens from inputs: valid_until='{valid_until_str}', bid_date='{bid_cutoff_str}'.",
                "confidence": 70.0
            }

        days_diff = (expiry_date - bid_date).days

        # Check valid_from if provided
        if start_date and start_date > bid_date:
            return {
                "status": "NOT YET VALID",
                "isValidOnBidDate": False,
                "daysRemainingOrOverdue": (start_date - bid_date).days,
                "message": f"{doc_name} issue date ({start_date.isoformat()}) is after the tender bid cutoff date ({bid_date.isoformat()}).",
                "confidence": 98.0
            }

        if days_diff >= 0:
            # Valid at bid date
            if days_diff < 30:
                status = "VALID AT BID DATE"
                msg = f"{doc_name} was valid on the bid cutoff date ({bid_date.isoformat()}), but had only {days_diff} days of validity remaining."
            else:
                status = "VALID AT BID DATE"
                msg = f"{doc_name} was active and valid on the bid cutoff date ({bid_date.isoformat()}) with {days_diff} days of validity remaining."
            
            return {
                "status": status,
                "isValidOnBidDate": True,
                "daysRemainingOrOverdue": days_diff,
                "message": msg,
                "confidence": 99.0
            }
        else:
            # Expired
            return {
                "status": "EXPIRED AT BID DATE",
                "isValidOnBidDate": False,
                "daysRemainingOrOverdue": abs(days_diff),
                "message": f"{doc_name} expired on {expiry_date.isoformat()}, which was {abs(days_diff)} days before the bid submission cutoff date ({bid_date.isoformat()}).",
                "confidence": 99.0
            }
