import frappe
from frappe import _


def get_context(context):
    if frappe.session.user == "Guest":
        frappe.local.flags.redirect_location = "/login?redirect-to=/supplier_portal"
        raise frappe.Redirect

    roles = set(frappe.get_roles(frappe.session.user))
    if "Supplier" not in roles and "System Manager" not in roles:
        frappe.throw(_("You need the Supplier role to access this portal."), frappe.PermissionError)

    context.no_cache = 1
    context.no_breadcrumbs = 1
    context.title = _("Supplier Portal")
    context.portal_type = "supplier"
    context.portal_theme = "supplier"
    context.initial_view = frappe.form_dict.get("view") or "dashboard"
    context.parents = [{"name": _("My Account"), "route": "/me"}]
    return context

