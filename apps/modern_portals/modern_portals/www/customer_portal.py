import frappe
from frappe import _


def get_context(context):
    if frappe.session.user == "Guest":
        frappe.local.flags.redirect_location = "/login?redirect-to=/customer_portal"
        raise frappe.Redirect

    roles = set(frappe.get_roles(frappe.session.user))
    if "Customer" not in roles and "System Manager" not in roles:
        frappe.throw(_("You need the Customer role to access this portal."), frappe.PermissionError)

    context.no_cache = 1
    context.no_breadcrumbs = 1
    context.title = _("Customer Portal")
    context.portal_type = "customer"
    context.portal_theme = "customer"
    context.initial_view = frappe.form_dict.get("view") or "dashboard"
    context.parents = [{"name": _("My Account"), "route": "/me"}]
    return context

