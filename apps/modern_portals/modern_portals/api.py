import frappe
from frappe import _
from frappe.utils import cint, flt, formatdate, get_url
from urllib.parse import quote


MAX_PAGE_LENGTH = 50
DEFAULT_PAGE_LENGTH = 10


def _ensure_authenticated():
    if frappe.session.user == "Guest":
        frappe.throw(_("Please log in to access this portal."), frappe.PermissionError)
    return frappe.session.user


def _get_roles(user):
    try:
        return set(frappe.get_roles(user))
    except Exception:
        return set()


def _first_existing(doctype, names):
    for name in dict.fromkeys([item for item in names if item]):
        if frappe.db.exists(doctype, name):
            return name
    return None


def _linked_party_from_contact(party_doctype, user):
    contact = frappe.db.get_value("Contact", {"email_id": user}, "name")
    if not contact:
        return None

    return frappe.db.get_value(
        "Dynamic Link",
        {
            "parenttype": "Contact",
            "parent": contact,
            "link_doctype": party_doctype,
        },
        "link_name",
    )


def _resolve_party(party_doctype):
    user = _ensure_authenticated()
    roles = _get_roles(user)
    role_name = "Customer" if party_doctype == "Customer" else "Supplier"

    if role_name not in roles and "System Manager" not in roles:
        frappe.throw(_("Your user is missing the {0} portal role.").format(role_name), frappe.PermissionError)

    candidates = [
        frappe.db.get_value("Portal User", {"user": user, "parenttype": party_doctype}, "parent"),
        _linked_party_from_contact(party_doctype, user),
        frappe.db.get_value(party_doctype, {"email_id": user}, "name"),
    ]
    party = _first_existing(party_doctype, candidates)

    if not party:
        frappe.throw(_("No linked {0} record was found for this user.").format(role_name), frappe.PermissionError)

    return party


def _page_args(start=0, page_length=DEFAULT_PAGE_LENGTH):
    start = max(cint(start), 0)
    page_length = min(max(cint(page_length) or DEFAULT_PAGE_LENGTH, 1), MAX_PAGE_LENGTH)
    return start, page_length


def _matches_permissions(doctype, row):
    try:
        return frappe.has_permission(doctype, "read", doc=row.get("name"))
    except Exception:
        return False


def _search_filter(search_fields, query):
    if not query:
        return None
    like_query = f"%{query}%"
    return [[field, "like", like_query] for field in search_fields]


def _get_documents(doctype, filters, fields, order_by, start=0, page_length=DEFAULT_PAGE_LENGTH, query=None, search_fields=None):
    start, page_length = _page_args(start, page_length)
    or_filters = _search_filter(search_fields or ["name"], (query or "").strip())

    rows = frappe.get_all(
        doctype,
        filters=filters,
        or_filters=or_filters,
        fields=fields,
        order_by=order_by,
        start=start,
        page_length=page_length,
    )
    rows = [row for row in rows if _matches_permissions(doctype, row)]

    total = frappe.db.count(doctype, filters=filters)
    return {
        "rows": rows,
        "total": total,
        "start": start,
        "page_length": page_length,
    }


def _currency_summary(rows, field="grand_total"):
    return sum(flt(row.get(field)) for row in rows)


def _document_url(doctype, name):
    return f"/app/{frappe.scrub(doctype).replace('_', '-')}/{name}"


def _pdf_url(doctype, name, print_format=None):
    params = f"doctype={quote(doctype)}&name={quote(name)}"
    if print_format:
        params += f"&format={quote(print_format)}"
    return f"/api/method/frappe.utils.print_format.download_pdf?{params}"


def _supplier_rfq_filters(supplier):
    if frappe.db.exists("DocType", "Request for Quotation Supplier"):
        rfq_names = frappe.get_all(
            "Request for Quotation Supplier",
            filters={"supplier": supplier},
            pluck="parent",
        )
        return {"name": ["in", rfq_names or ["__no_matching_rfq__"]], "docstatus": ["<", 2]}

    return {"supplier": supplier, "docstatus": ["<", 2]}


def _decorate_customer_order(row):
    return {
        **row,
        "transaction_date": formatdate(row.get("transaction_date")) if row.get("transaction_date") else "",
        "document_url": _document_url("Sales Order", row.name),
        "pdf_url": _pdf_url("Sales Order", row.name),
    }


def _decorate_invoice(row):
    return {
        **row,
        "posting_date": formatdate(row.get("posting_date")) if row.get("posting_date") else "",
        "document_url": _document_url("Sales Invoice", row.name),
        "pdf_url": _pdf_url("Sales Invoice", row.name),
    }


def _decorate_supplier_rfq(row):
    return {
        **row,
        "transaction_date": formatdate(row.get("transaction_date")) if row.get("transaction_date") else "",
        "document_url": _document_url("Request for Quotation", row.name),
        "pdf_url": _pdf_url("Request for Quotation", row.name),
    }


def _decorate_supplier_po(row):
    return {
        **row,
        "transaction_date": formatdate(row.get("transaction_date")) if row.get("transaction_date") else "",
        "document_url": _document_url("Purchase Order", row.name),
        "pdf_url": _pdf_url("Purchase Order", row.name),
    }


@frappe.whitelist()
def get_customer_dashboard_data():
    customer = _resolve_party("Customer")

    order_filters = {"customer": customer, "docstatus": ["<", 2]}
    invoice_filters = {"customer": customer, "docstatus": ["<", 2]}
    unpaid_invoice_filters = {"customer": customer, "status": ["in", ["Unpaid", "Overdue", "Partly Paid"]], "docstatus": 1}

    recent_orders = frappe.get_all(
        "Sales Order",
        filters=order_filters,
        fields=["name", "status", "grand_total", "currency", "transaction_date"],
        order_by="transaction_date desc, creation desc",
        page_length=5,
    )
    recent_orders = [_decorate_customer_order(row) for row in recent_orders if _matches_permissions("Sales Order", row)]

    outstanding_invoices = frappe.get_all(
        "Sales Invoice",
        filters=unpaid_invoice_filters,
        fields=["name", "status", "grand_total", "outstanding_amount", "currency", "posting_date"],
        order_by="posting_date desc, creation desc",
        page_length=5,
    )
    outstanding_invoices = [_decorate_invoice(row) for row in outstanding_invoices if _matches_permissions("Sales Invoice", row)]

    return {
        "party": {"doctype": "Customer", "name": customer},
        "widgets": {
            "open_orders": frappe.db.count("Sales Order", {**order_filters, "status": ["not in", ["Completed", "Closed", "Cancelled"]]}),
            "paid_invoices": frappe.db.count("Sales Invoice", {**invoice_filters, "status": "Paid"}),
            "unpaid_invoices": frappe.db.count("Sales Invoice", unpaid_invoice_filters),
            "outstanding_amount": _currency_summary(outstanding_invoices, "outstanding_amount"),
        },
        "recent_orders": recent_orders,
        "outstanding_invoices": outstanding_invoices,
    }


@frappe.whitelist()
def get_customer_orders(start=0, page_length=DEFAULT_PAGE_LENGTH, query=None):
    customer = _resolve_party("Customer")
    data = _get_documents(
        "Sales Order",
        {"customer": customer, "docstatus": ["<", 2]},
        ["name", "status", "grand_total", "currency", "transaction_date", "delivery_date"],
        "transaction_date desc, creation desc",
        start,
        page_length,
        query,
        ["name", "status", "po_no"],
    )
    data["rows"] = [_decorate_customer_order(row) for row in data["rows"]]
    return data


@frappe.whitelist()
def get_customer_invoices(start=0, page_length=DEFAULT_PAGE_LENGTH, query=None):
    customer = _resolve_party("Customer")
    data = _get_documents(
        "Sales Invoice",
        {"customer": customer, "docstatus": ["<", 2]},
        ["name", "status", "grand_total", "outstanding_amount", "currency", "posting_date", "due_date"],
        "posting_date desc, creation desc",
        start,
        page_length,
        query,
        ["name", "status"],
    )
    data["rows"] = [_decorate_invoice(row) for row in data["rows"]]
    return data


@frappe.whitelist()
def get_customer_shipments(start=0, page_length=DEFAULT_PAGE_LENGTH, query=None):
    customer = _resolve_party("Customer")
    data = _get_documents(
        "Delivery Note",
        {"customer": customer, "docstatus": ["<", 2]},
        ["name", "status", "grand_total", "currency", "posting_date"],
        "posting_date desc, creation desc",
        start,
        page_length,
        query,
        ["name", "status"],
    )
    data["rows"] = [
        {
            **row,
            "posting_date": formatdate(row.get("posting_date")) if row.get("posting_date") else "",
            "document_url": _document_url("Delivery Note", row.name),
            "pdf_url": _pdf_url("Delivery Note", row.name),
        }
        for row in data["rows"]
    ]
    return data


@frappe.whitelist()
def get_supplier_dashboard_data():
    supplier = _resolve_party("Supplier")

    rfq_filters = _supplier_rfq_filters(supplier)
    po_filters = {"supplier": supplier, "docstatus": ["<", 2]}
    unpaid_invoice_filters = {"supplier": supplier, "status": ["in", ["Unpaid", "Overdue", "Partly Paid"]], "docstatus": 1}

    recent_rfqs = frappe.get_all(
        "Request for Quotation",
        filters=rfq_filters,
        fields=["name", "status", "transaction_date", "schedule_date"],
        order_by="transaction_date desc, creation desc",
        page_length=5,
    )
    recent_rfqs = [_decorate_supplier_rfq(row) for row in recent_rfqs if _matches_permissions("Request for Quotation", row)]

    active_pos = frappe.get_all(
        "Purchase Order",
        filters={**po_filters, "status": ["not in", ["Completed", "Closed", "Cancelled"]]},
        fields=["name", "status", "grand_total", "currency", "transaction_date", "schedule_date"],
        order_by="transaction_date desc, creation desc",
        page_length=5,
    )
    active_pos = [_decorate_supplier_po(row) for row in active_pos if _matches_permissions("Purchase Order", row)]

    return {
        "party": {"doctype": "Supplier", "name": supplier},
        "widgets": {
            "open_rfqs": frappe.db.count("Request for Quotation", {**rfq_filters, "status": ["not in", ["Submitted", "Stopped", "Cancelled"]]}),
            "active_pos": frappe.db.count("Purchase Order", {**po_filters, "status": ["not in", ["Completed", "Closed", "Cancelled"]]}),
            "unpaid_invoices": frappe.db.count("Purchase Invoice", unpaid_invoice_filters),
            "active_po_value": _currency_summary(active_pos, "grand_total"),
        },
        "recent_rfqs": recent_rfqs,
        "active_pos": active_pos,
    }


@frappe.whitelist()
def get_supplier_rfqs(start=0, page_length=DEFAULT_PAGE_LENGTH, query=None):
    supplier = _resolve_party("Supplier")
    data = _get_documents(
        "Request for Quotation",
        _supplier_rfq_filters(supplier),
        ["name", "status", "transaction_date", "schedule_date"],
        "transaction_date desc, creation desc",
        start,
        page_length,
        query,
        ["name", "status"],
    )
    data["rows"] = [_decorate_supplier_rfq(row) for row in data["rows"]]
    return data


@frappe.whitelist()
def get_supplier_purchase_orders(start=0, page_length=DEFAULT_PAGE_LENGTH, query=None):
    supplier = _resolve_party("Supplier")
    data = _get_documents(
        "Purchase Order",
        {"supplier": supplier, "docstatus": ["<", 2]},
        ["name", "status", "grand_total", "currency", "transaction_date", "schedule_date"],
        "transaction_date desc, creation desc",
        start,
        page_length,
        query,
        ["name", "status"],
    )
    data["rows"] = [_decorate_supplier_po(row) for row in data["rows"]]
    return data


@frappe.whitelist()
def get_supplier_invoices(start=0, page_length=DEFAULT_PAGE_LENGTH, query=None):
    supplier = _resolve_party("Supplier")
    data = _get_documents(
        "Purchase Invoice",
        {"supplier": supplier, "docstatus": ["<", 2]},
        ["name", "status", "grand_total", "outstanding_amount", "currency", "posting_date", "due_date"],
        "posting_date desc, creation desc",
        start,
        page_length,
        query,
        ["name", "status"],
    )
    data["rows"] = [
        {
            **row,
            "posting_date": formatdate(row.get("posting_date")) if row.get("posting_date") else "",
            "document_url": _document_url("Purchase Invoice", row.name),
            "pdf_url": _pdf_url("Purchase Invoice", row.name),
        }
        for row in data["rows"]
    ]
    return data


@frappe.whitelist()
def get_portal_bootstrap(portal_type):
    user = _ensure_authenticated()
    if portal_type == "customer":
        party = _resolve_party("Customer")
    elif portal_type == "supplier":
        party = _resolve_party("Supplier")
    else:
        frappe.throw(_("Unknown portal type."), frappe.ValidationError)

    return {
        "user": user,
        "full_name": frappe.db.get_value("User", user, "full_name") or user,
        "site_url": get_url(),
        "portal_type": portal_type,
        "party": party,
    }
