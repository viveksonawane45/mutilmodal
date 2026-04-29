from pydantic import BaseModel


class Metric(BaseModel):
    id: str
    label: str
    value: str
    trend: str
    severity: str


class EventSummary(BaseModel):
    id: str
    type: str
    name: str
    location: str
    riskScore: float
    lat: float
    lng: float
    radiusKm: float
    status: str


class DashboardResponse(BaseModel):
    metrics: list[Metric]
    events: list[EventSummary]
    activity: list[str]
    recommendations: list[str]
