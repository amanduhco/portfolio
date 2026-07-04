// Thin wrapper around gtag so click/engagement events are consistent
// and safe to call even if analytics hasn't loaded yet (ad blockers, etc).

/**
 * Fire a GA4 event.
 * @param {string} name   GA4 event name, e.g. "project_click"
 * @param {object} params Extra event params, e.g. { project: "mercury-automation" }
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

// Convenience wrappers for the most common interactions on this site.

export function trackNavClick(section) {
  trackEvent('nav_click', { section })
}

export function trackOutboundLink(label, url) {
  trackEvent('outbound_click', { link_label: label, link_url: url })
}

export function trackProjectClick(company, project) {
  trackEvent('project_click', { company, project })
}

export function trackLightboxClose(company, project) {
  trackEvent('lightbox_close', { company, project })
}

export function trackCta(label) {
  trackEvent('cta_click', { cta_label: label })
}

export function trackContactAction(action, label) {
  // action: "reveal_start" | "contact_link" | "reset"
  trackEvent('contact_interaction', { action, label })
}
