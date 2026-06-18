(function () {
  const roots = document.querySelectorAll("[data-modern-portal]");
  if (!roots.length) return;

  const methods = {
    customer: {
      bootstrap: "modern_portals.api.get_portal_bootstrap",
      dashboard: "modern_portals.api.get_customer_dashboard_data",
      views: {
        dashboard: { title: "Dashboard" },
        orders: {
          title: "Orders",
          method: "modern_portals.api.get_customer_orders",
          subtitle: "Sales orders linked to your account",
          columns: [
            ["name", "Order"],
            ["status", "Status", "status"],
            ["transaction_date", "Date"],
            ["grand_total", "Total", "money"],
            ["actions", "Actions", "actions"]
          ]
        },
        invoices: {
          title: "Invoices",
          method: "modern_portals.api.get_customer_invoices",
          subtitle: "Invoices and outstanding balances",
          columns: [
            ["name", "Invoice"],
            ["status", "Status", "status"],
            ["posting_date", "Date"],
            ["outstanding_amount", "Due", "money"],
            ["grand_total", "Total", "money"],
            ["actions", "Actions", "actions"]
          ]
        },
        shipments: {
          title: "Shipments",
          method: "modern_portals.api.get_customer_shipments",
          subtitle: "Delivery notes for fulfilled orders",
          columns: [
            ["name", "Delivery Note"],
            ["status", "Status", "status"],
            ["posting_date", "Date"],
            ["grand_total", "Value", "money"],
            ["actions", "Actions", "actions"]
          ]
        }
      }
    },
    supplier: {
      bootstrap: "modern_portals.api.get_portal_bootstrap",
      dashboard: "modern_portals.api.get_supplier_dashboard_data",
      views: {
        dashboard: { title: "Dashboard" },
        rfqs: {
          title: "RFQs",
          method: "modern_portals.api.get_supplier_rfqs",
          subtitle: "Open and recent requests for quotation",
          columns: [
            ["name", "RFQ"],
            ["status", "Status", "status"],
            ["transaction_date", "Date"],
            ["schedule_date", "Required By"],
            ["actions", "Actions", "actions"]
          ]
        },
        "purchase-orders": {
          title: "Purchase Orders",
          method: "modern_portals.api.get_supplier_purchase_orders",
          subtitle: "Purchase orders assigned to your supplier account",
          columns: [
            ["name", "Purchase Order"],
            ["status", "Status", "status"],
            ["transaction_date", "Date"],
            ["schedule_date", "Required By"],
            ["grand_total", "Total", "money"],
            ["actions", "Actions", "actions"]
          ]
        },
        invoices: {
          title: "Invoices",
          method: "modern_portals.api.get_supplier_invoices",
          subtitle: "Supplier invoices and outstanding balances",
          columns: [
            ["name", "Invoice"],
            ["status", "Status", "status"],
            ["posting_date", "Date"],
            ["outstanding_amount", "Due", "money"],
            ["grand_total", "Total", "money"],
            ["actions", "Actions", "actions"]
          ]
        }
      }
    }
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function call(method, args) {
    if (!window.frappe || !frappe.call) {
      return Promise.reject(new Error("Frappe client API is unavailable on this page."));
    }

    return new Promise((resolve, reject) => {
      frappe.call({
        method,
        args: args || {},
        freeze: false,
        callback: (response) => resolve(response.message || {}),
        error: (error) => reject(error)
      });
    });
  }

  function money(value, currency) {
    const amount = Number(value || 0);
    try {
      return new Intl.NumberFormat(undefined, {
        style: currency ? "currency" : "decimal",
        currency: currency || undefined,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
  }

  function statusClass(status) {
    const normalized = String(status || "").toLowerCase();
    if (["paid", "completed", "submitted", "to bill", "to receive and bill"].includes(normalized)) return "is-success";
    if (["draft", "pending", "partly paid", "to receive", "to deliver"].includes(normalized)) return "is-warning";
    if (["cancelled", "closed", "overdue", "stopped"].includes(normalized)) return "is-danger";
    return "is-info";
  }

  function skeleton() {
    return `
      <div class="mp-skeleton-grid">
        <div class="mp-skeleton"></div>
        <div class="mp-skeleton"></div>
        <div class="mp-skeleton"></div>
        <div class="mp-skeleton"></div>
      </div>
      <div class="mp-skeleton-table">
        <div class="mp-skeleton" style="min-height: 18rem"></div>
      </div>
    `;
  }

  function metric(label, value, hint) {
    return `
      <article class="mp-card">
        <p class="mp-card-label">${escapeHtml(label)}</p>
        <p class="mp-card-value">${escapeHtml(value)}</p>
        <p class="mp-card-hint">${escapeHtml(hint || "")}</p>
      </article>
    `;
  }

  function compactTable(title, rows, columns) {
    const body = rows.length
      ? rows.map((row) => `
          <tr>
            ${columns.map((column) => `<td>${cell(row, column)}</td>`).join("")}
          </tr>
        `).join("")
      : `<tr><td colspan="${columns.length}" class="mp-empty">No records found.</td></tr>`;

    return `
      <section class="mp-panel">
        <div class="mp-card-head">
          <div>
            <h2>${escapeHtml(title)}</h2>
          </div>
        </div>
        <div class="mp-table-wrap">
          <table class="mp-table">
            <thead>
              <tr>${columns.map((column) => `<th>${escapeHtml(column[1])}</th>`).join("")}</tr>
            </thead>
            <tbody>${body}</tbody>
          </table>
        </div>
      </section>
    `;
  }

  function cell(row, column) {
    const [key, , type] = column;
    if (type === "status") {
      return `<span class="mp-status ${statusClass(row[key])}">${escapeHtml(row[key] || "Unknown")}</span>`;
    }
    if (type === "money") {
      return escapeHtml(money(row[key], row.currency));
    }
    if (type === "actions") {
      return `
        <span class="mp-action-row">
          <a class="mp-action" href="${escapeHtml(row.document_url || "#")}">Open</a>
          <a class="mp-action is-secondary" href="${escapeHtml(row.pdf_url || "#")}" target="_blank" rel="noopener">PDF</a>
        </span>
      `;
    }
    return escapeHtml(row[key] || "");
  }

  function renderDashboard(root, portalType, data) {
    const customer = portalType === "customer";
    const widgets = data.widgets || {};
    const cards = customer
      ? [
          metric("Open Orders", widgets.open_orders || 0, "Active sales orders"),
          metric("Paid Invoices", widgets.paid_invoices || 0, "Settled billing"),
          metric("Unpaid Invoices", widgets.unpaid_invoices || 0, "Needs attention"),
          metric("Outstanding", money(widgets.outstanding_amount || 0), "Open balance")
        ]
      : [
          metric("Open RFQs", widgets.open_rfqs || 0, "Awaiting quotation"),
          metric("Active POs", widgets.active_pos || 0, "Current commitments"),
          metric("Unpaid Invoices", widgets.unpaid_invoices || 0, "Pending settlement"),
          metric("Active PO Value", money(widgets.active_po_value || 0), "Open order value")
        ];

    const tables = customer
      ? [
          compactTable("Recent Orders", data.recent_orders || [], [
            ["name", "Order"],
            ["status", "Status", "status"],
            ["transaction_date", "Date"],
            ["grand_total", "Total", "money"],
            ["actions", "Actions", "actions"]
          ]),
          compactTable("Outstanding Invoices", data.outstanding_invoices || [], [
            ["name", "Invoice"],
            ["status", "Status", "status"],
            ["posting_date", "Date"],
            ["outstanding_amount", "Due", "money"],
            ["actions", "Actions", "actions"]
          ])
        ]
      : [
          compactTable("Recent RFQs", data.recent_rfqs || [], [
            ["name", "RFQ"],
            ["status", "Status", "status"],
            ["transaction_date", "Date"],
            ["actions", "Actions", "actions"]
          ]),
          compactTable("Active Purchase Orders", data.active_pos || [], [
            ["name", "Purchase Order"],
            ["status", "Status", "status"],
            ["transaction_date", "Date"],
            ["grand_total", "Total", "money"],
            ["actions", "Actions", "actions"]
          ])
        ];

    root.querySelector("[data-view-container]").innerHTML = `
      <section class="mp-grid">${cards.join("")}</section>
      ${tables.join("")}
    `;
  }

  function renderList(root, config, data, state) {
    const rows = data.rows || [];
    const total = Number(data.total || 0);
    const start = Number(data.start || state.start || 0);
    const pageLength = Number(data.page_length || state.pageLength || 10);
    const end = Math.min(start + rows.length, total);
    const canBack = start > 0;
    const canNext = start + pageLength < total;

    const body = rows.length
      ? rows.map((row) => `<tr>${config.columns.map((column) => `<td>${cell(row, column)}</td>`).join("")}</tr>`).join("")
      : `<tr><td colspan="${config.columns.length}" class="mp-empty">No records found.</td></tr>`;

    root.querySelector("[data-view-container]").innerHTML = `
      <section class="mp-panel">
        <div class="mp-card-head">
          <div>
            <h2>${escapeHtml(config.title)}</h2>
            <p>${escapeHtml(config.subtitle || "")}</p>
          </div>
        </div>
        <div class="mp-table-tools">
          <input class="mp-search" data-search placeholder="Search" value="${escapeHtml(state.query || "")}">
        </div>
        <div class="mp-table-wrap">
          <table class="mp-table">
            <thead>
              <tr>${config.columns.map((column) => `<th>${escapeHtml(column[1])}</th>`).join("")}</tr>
            </thead>
            <tbody>${body}</tbody>
          </table>
        </div>
        <div class="mp-table-foot">
          <span>${total ? `${start + 1}-${end} of ${total}` : "0 records"}</span>
          <span class="mp-action-row">
            <button class="mp-action is-secondary" data-page="prev" ${canBack ? "" : "disabled"}>Prev</button>
            <button class="mp-action" data-page="next" ${canNext ? "" : "disabled"}>Next</button>
          </span>
        </div>
      </section>
    `;
  }

  function setAlert(root, message) {
    const alert = root.querySelector("[data-portal-alert]");
    if (!alert) return;
    if (!message) {
      alert.hidden = true;
      alert.textContent = "";
      return;
    }
    alert.hidden = false;
    alert.textContent = message;
  }

  function setTitle(root, title) {
    const target = root.querySelector("[data-page-title]");
    if (target) target.textContent = title;
  }

  function setActive(root, view) {
    root.querySelectorAll("[data-view]").forEach((item) => {
      item.classList.toggle("is-active", item.dataset.view === view);
    });
  }

  function init(root) {
    const portalType = root.dataset.portalType;
    const portal = methods[portalType];
    if (!portal) return;

    const state = {
      view: portal.views[root.dataset.initialView] ? root.dataset.initialView : "dashboard",
      pages: {}
    };

    async function load(view) {
      const config = portal.views[view] || portal.views.dashboard;
      state.view = view;
      setAlert(root, "");
      setTitle(root, config.title);
      setActive(root, view);
      root.classList.remove("is-menu-open");
      root.querySelector("[data-view-container]").innerHTML = skeleton();

      try {
        if (view === "dashboard") {
          const data = await call(portal.dashboard);
          renderDashboard(root, portalType, data);
        } else {
          state.pages[view] = state.pages[view] || { start: 0, pageLength: 10, query: "" };
          const page = state.pages[view];
          const data = await call(config.method, {
            start: page.start,
            page_length: page.pageLength,
            query: page.query
          });
          renderList(root, config, data, page);
        }
      } catch (error) {
        root.querySelector("[data-view-container]").innerHTML = "";
        setAlert(root, error.message || "Unable to load portal data.");
      }
    }

    root.addEventListener("click", (event) => {
      const nav = event.target.closest("[data-view]");
      if (nav) {
        load(nav.dataset.view);
        return;
      }

      const refresh = event.target.closest("[data-refresh]");
      if (refresh) {
        load(state.view);
        return;
      }

      const menu = event.target.closest("[data-menu-toggle]");
      if (menu) {
        root.classList.add("is-menu-open");
        return;
      }

      if (event.target.closest("[data-sidebar-scrim]")) {
        root.classList.remove("is-menu-open");
        return;
      }

      const pageButton = event.target.closest("[data-page]");
      if (pageButton) {
        const page = state.pages[state.view];
        const direction = pageButton.dataset.page;
        page.start = Math.max(0, page.start + (direction === "next" ? page.pageLength : -page.pageLength));
        load(state.view);
      }
    });

    let searchTimer = null;
    root.addEventListener("input", (event) => {
      const search = event.target.closest("[data-search]");
      if (!search) return;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        const page = state.pages[state.view];
        page.query = search.value;
        page.start = 0;
        load(state.view);
      }, 260);
    });

    call(portal.bootstrap, { portal_type: portalType })
      .then((data) => {
        const name = root.querySelector("[data-user-name]");
        if (name && data.full_name) name.textContent = data.full_name;
      })
      .catch(() => {});

    load(state.view);
  }

  roots.forEach(init);
})();

