"""
Bidders API Router
e-BID PRAMAAN — CPCL
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Bidder
from app.schemas.schemas import BidderResponse

router = APIRouter(prefix="/bidders", tags=["Bidders"])

@router.get("/{bidder_id}", response_model=BidderResponse)
def get_bidder(bidder_id: str, db: Session = Depends(get_db)):
    """Retrieves full bidder compliance dossier and extracted evidence."""
    bidder = db.query(Bidder).filter(Bidder.id == bidder_id).first()
    if not bidder:
        raise HTTPException(status_code=404, detail=f"Bidder with ID {bidder_id} not found")
    return bidder
