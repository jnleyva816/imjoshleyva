// The build pre-renders each page in Node, where there is no window; it sets
// this global to the page's path first.
export const currentPath = () => globalThis.__SSR_PATH__ ?? window.location.pathname;

/** True on the one-page home; subpages need "/#work" instead of "#work". */
export const onHome = () => ["/", "/index.html"].includes(currentPath());

/** Turns an in-page anchor into one that also works from a subpage. */
export const homeHref = (href) => (href.startsWith("#") && !onHome() ? `/${href}` : href);

export const projectHref = (project) => `/projects/${project.slug}`;
