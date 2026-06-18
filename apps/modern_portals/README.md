# Modern Portals

Modern Portals is a custom ERPNext/Frappe app that replaces the default customer and supplier portal experience with responsive dashboard-style portal pages.

Routes:

- `/customer_portal`
- `/supplier_portal`
- `/orders` redirects to `/customer_portal?view=orders`
- `/invoices` redirects to `/customer_portal?view=invoices`
- `/rfqs` redirects to `/supplier_portal?view=rfqs`
- `/purchase-orders` redirects to `/supplier_portal?view=purchase-orders`

Install from a Frappe bench:

```bash
bench get-app /absolute/path/to/apps/modern_portals
bench --site your-site.local install-app modern_portals
bench --site your-site.local migrate
bench build --app modern_portals
```

