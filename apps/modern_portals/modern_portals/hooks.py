app_name = "modern_portals"
app_title = "Modern Portals"
app_publisher = "Modern Portals"
app_description = "Premium customer and supplier portal experiences for ERPNext"
app_email = "admin@example.com"
app_license = "MIT"
required_apps = ["frappe", "erpnext"]

website_context = {
    "favicon": "/assets/modern_portals/images/favicon.svg",
}

app_include_css = [
    "/assets/modern_portals/css/tailwind.css",
]

app_include_js = [
    "/assets/modern_portals/js/portal.js",
]

web_include_css = [
    "/assets/modern_portals/css/tailwind.css",
]

web_include_js = [
    "/assets/modern_portals/js/portal.js",
]

website_redirects = [
    {"source": "/orders", "target": "/customer_portal?view=orders"},
    {"source": "/invoices", "target": "/customer_portal?view=invoices"},
    {"source": "/shipments", "target": "/customer_portal?view=shipments"},
    {"source": "/rfqs", "target": "/supplier_portal?view=rfqs"},
    {"source": "/purchase-orders", "target": "/supplier_portal?view=purchase-orders"},
    {"source": "/supplier-invoices", "target": "/supplier_portal?view=invoices"},
]

portal_menu_items = [
    {
        "title": "Customer Portal",
        "route": "/customer_portal",
        "reference_doctype": "Sales Order",
        "role": "Customer",
    },
    {
        "title": "Supplier Portal",
        "route": "/supplier_portal",
        "reference_doctype": "Purchase Order",
        "role": "Supplier",
    },
]

fixtures = [
    {"doctype": "Role Profile", "filters": [["name", "in", ["Modern Portal Customer", "Modern Portal Supplier"]]]}
]

