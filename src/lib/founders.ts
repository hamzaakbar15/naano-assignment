// Naano's founders, as listed on naano.com/about. Photos are loaded straight
// from naano.com (their own published headshots) rather than copied into this
// repo, so they always match the real people named here.
export const FOUNDERS = [
  { name: "Thomas", role: "CEO & Co-founder", photo: "https://naano.com/tom.png" },
  { name: "Alexis", role: "CMO & Co-founder", photo: "https://naano.com/alex.png" },
  { name: "Justine", role: "CTO & Co-founder", photo: "https://naano.com/ju.jpeg" },
] as const;

export const CEO = FOUNDERS[0];
