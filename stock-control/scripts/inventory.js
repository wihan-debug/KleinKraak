/**
 * inventory.js — Compatibility stub for KleinKraak Stock Control v2.0
 *
 * The stock control system was rebuilt as a single app.js.
 * This file exists solely so that references to it in invoices.html
 * do not cause 404 errors. The InvoiceManager uses its own hardcoded
 * product list and does not depend on this module.
 */
window.Inventory = {
    async load()    { return []; },
    getAll()        { return []; },
    findById()      { return null; }
};
