from sqlalchemy import (
    create_engine, Column, Integer, String, Date, DateTime,
    ForeignKey, Enum, func
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

Base = declarative_base()

# ---------- Members ----------
class Member(Base):
    __tablename__ = "members"

    member_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(Enum("borrower", "staff", name="role_types"), default="borrower")

    # Relationships
    rentals = relationship("Rental", back_populates="member")
    requests = relationship("Request", back_populates="member")
    logs = relationship("Log", back_populates="user")

    def __repr__(self):
        return f"<Member(name='{self.name}', role='{self.role}')>"


# ---------- Items ----------
class Item(Base):
    __tablename__ = "items"

    item_id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String)          # e.g., "Women's Dresses"
    size = Column(String)
    color = Column(String)
    brand = Column(String)
    status = Column(Enum("available", "rented", "repair", "retired", name="item_status"), default="available")
    image_url = Column(String)

    # Relationships
    rentals = relationship("Rental", back_populates="item")
    requests = relationship("Request", back_populates="item")
    logs = relationship("Log", back_populates="item")

    def __repr__(self):
        return f"<Item(name='{self.name}', status='{self.status}')>"


# ---------- Requests ----------
class Request(Base):
    __tablename__ = "requests"

    request_id = Column(Integer, primary_key=True)
    member_id = Column(Integer, ForeignKey("members.member_id"))
    item_id = Column(Integer, ForeignKey("items.item_id"))
    request_date = Column(Date, server_default=func.current_date())
    start_date = Column(Date)
    end_date = Column(Date)
    purpose = Column(String)
    status = Column(Enum("pending", "approved", "rejected", name="request_status"), default="pending")

    # Relationships
    member = relationship("Member", back_populates="requests")
    item = relationship("Item", back_populates="requests")

    def __repr__(self):
        return f"<Request(item={self.item_id}, member={self.member_id}, status='{self.status}')>"


# ---------- Rentals ----------
class Rental(Base):
    __tablename__ = "rentals"

    rental_id = Column(Integer, primary_key=True)
    item_id = Column(Integer, ForeignKey("items.item_id"))
    member_id = Column(Integer, ForeignKey("members.member_id"))
    checkout_date = Column(Date)
    expected_return_date = Column(Date)
    actual_return_date = Column(Date)
    status = Column(Enum("checked_out", "returned", "overdue", name="rental_status"), default="checked_out")

    # Relationships
    item = relationship("Item", back_populates="rentals")
    member = relationship("Member", back_populates="rentals")

    def __repr__(self):
        return f"<Rental(item={self.item_id}, member={self.member_id}, status='{self.status}')>"


# ---------- Logs ----------
class Log(Base):
    __tablename__ = "logs"

    log_id = Column(Integer, primary_key=True)
    item_id = Column(Integer, ForeignKey("items.item_id"))
    user_id = Column(Integer, ForeignKey("members.member_id"))
    timestamp = Column(DateTime, server_default=func.now())
    action = Column(String)  # e.g. "added", "checked_out", "returned"

    # Relationships
    item = relationship("Item", back_populates="logs")
    user = relationship("Member", back_populates="logs")

    def __repr__(self):
        return f"<Log(item={self.item_id}, action='{self.action}', time={self.timestamp})>"
