from app.schemas.analytics import DashboardResponse, EventSummary, Metric


class AnalyticsService:
    def dashboard(self) -> DashboardResponse:
        return DashboardResponse(
            metrics=[
                Metric(id="risk", label="Composite risk index", value="78.4", trend="+6.2", severity="critical"),
                Metric(id="sensors", label="Active data sources", value="1,428", trend="+114", severity="stable"),
                Metric(id="alerts", label="Open alerts", value="37", trend="-8", severity="watch"),
                Metric(id="teams", label="Response teams", value="92", trend="+11", severity="stable")
            ],
            events=[
                EventSummary(id="pune-flood", type="flood", name="Mula-Mutha Flood Watch", location="Pune, India", riskScore=82, lat=18.5204, lng=73.8567, radiusKm=22, status="active"),
                EventSummary(id="sf-quake", type="earthquake", name="Bay Seismic Cluster", location="San Francisco, USA", riskScore=68, lat=37.7749, lng=-122.4194, radiusKm=36, status="monitoring"),
                EventSummary(id="aus-fire", type="wildfire", name="Blue Mountains Fireline", location="NSW, Australia", riskScore=75, lat=-33.7, lng=150.3, radiusKm=44, status="active"),
                EventSummary(id="gulf-hurricane", type="hurricane", name="Gulf Storm Delta", location="Gulf Coast, USA", riskScore=71, lat=29.7604, lng=-95.3698, radiusKm=88, status="monitoring")
            ],
            activity=[
                "Satellite anomaly classifier raised flood confidence to 91 percent in Pune sector C.",
                "Emergency manager approved high-water rescue units for staging.",
                "USGS ingestion normalized seismic tremors into Bay Seismic Cluster.",
                "AI report draft created for Regional Flood Resilience Study."
            ],
            recommendations=[
                "Open low-congestion shelters west of Aundh.",
                "Stage boats within 18 minutes of the flood impact core.",
                "Validate drifting sensor cluster with satellite flood mask."
            ]
        )


analytics_service = AnalyticsService()
