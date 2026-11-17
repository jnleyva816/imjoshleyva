/** True on the one-page home; subpages need "/#work" instead of "#work". */
export const onHome = () => window.location.pathname === "/" || window.location.pathname === "/index.html";

/** Turns an in-page anchor into one that also works from a subpage. */
export const homeHref = (href) => (href.startsWith("#") && !onHome() ? `/${href}` : href);

export const projectHref = (project) => `/projects/${project.slug}`;
