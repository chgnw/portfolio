/**
 * String ids: `<PREFIX>-<time><random>` — time-sortable, URL safe, works in
 * both the browser and Node (uses Web Crypto).
 */
export const ID_PREFIX = {
  user: "USR",
  session: "SES",
  loginAttempt: "LGA",
  media: "MED",
  profile: "PRF",
  section: "SEC",
  siteText: "TXT",
  organization: "ORG",
  employmentType: "EMP",
  technology: "TEC",
  experience: "EXP",
  education: "EDU",
  project: "PRJ",
  projectImage: "PIM",
  projectTechnology: "PTC",
  projectLink: "PLK",
  projectDetail: "PDT",
  skill: "SKL",
  socialLink: "SOC",
  publish: "PUB",
} as const;

export type IdKind = keyof typeof ID_PREFIX;

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32

export function newId(kind: IdKind): string {
  let time = Date.now();
  let timePart = "";
  for (let i = 0; i < 10; i++) {
    timePart = ALPHABET[time % 32] + timePart;
    time = Math.floor(time / 32);
  }
  const bytes = new Uint8Array(10);
  globalThis.crypto.getRandomValues(bytes);
  let randPart = "";
  for (const b of bytes) randPart += ALPHABET[b % 32];
  return `${ID_PREFIX[kind]}-${timePart}${randPart}`;
}

export const ID_PATTERN = /^[A-Z]{3}-[0-9A-Z]{4,40}$/;
