/** Shared by the /resume page and scripts/build-resume.mjs. */

const MONTHS = {
  January: "Jan", February: "Feb", March: "Mar", April: "Apr", May: "May", June: "Jun",
  July: "Jul", August: "Aug", September: "Sep", October: "Oct", November: "Nov", December: "Dec",
};

/** "November 2026 — Present" becomes "Nov 2026 – Present". */
export const short = (text) =>
  text.replace(/\b[A-Z][a-z]+\b/g, (word) => MONTHS[word] ?? word).replace(/\s*—\s*/g, " – ");

/** Consecutive entries at one company become a single block with several roles. */
export function byCompany(experience) {
  const companies = [];
  for (const job of experience) {
    const last = companies.at(-1);
    if (last && last.company === job.company) last.roles.push(job);
    else companies.push({ company: job.company, roles: [job] });
  }
  return companies;
}

/** Overall span of a company block, oldest start to newest end. */
export const span = (roles) => {
  const first = short(roles.at(-1).duration).split(" – ")[0];
  const end = short(roles[0].duration).split(" – ")[1];
  return `${first} – ${end}`;
};
