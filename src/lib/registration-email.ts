function splitName(full: string): [string, string] {
  const t = full.trim();
  const i = t.indexOf(" ");
  if (i <= 0) return [t, ""];
  return [t.slice(0, i), t.slice(i + 1).trim()];
}

export type RegistrationEmailArgs = {
  parentName: string;
  childName: string;
  weekLabel?: string;
  registrationType?: string;
  extendedPickup?: string;
  pickupTime?: string;
};

export function buildRegistrationReceivedText({
  parentName,
  childName,
  weekLabel,
  registrationType,
  extendedPickup,
  pickupTime,
}: RegistrationEmailArgs): string {
  const [parentFirst] = splitName(String(parentName));
  const [childFirst] = splitName(String(childName));

  const registrationLabel =
    registrationType === "sibling" ? "Sibling registration" : "Registration";

  const weekLine = weekLabel ? `Week: ${weekLabel}` : "";

  const pickupLine =
    extendedPickup === "yes"
      ? `Extended pickup: Yes${pickupTime ? ` (requested: ${pickupTime})` : ""}`
      : "";

  const detailsBlock = [weekLine, registrationLabel, pickupLine]
    .filter(Boolean)
    .map((l) => `- ${l}`)
    .join("\n");

  return `Hi ${parentFirst || "there"},

Thanks for registering ${childFirst || "your camper"} for Heatherwood Football Camp — we've received your registration.

Next step: please complete your payment using the link shown after you submit the form. Payment confirms your spot.

${detailsBlock ? `Details we have on file:\n${detailsBlock}\n` : ""}If anything changes (week, t-shirt size, emergency contact, etc.), just reply to this email and we'll update it.

What to bring each day:
- Water bottle
- Cleats (recommended) + athletic shoes
- Sunscreen

Questions? Reply here or email us at heatherwoodfootballcamp@gmail.com.

See you on the field,
Heatherwood Football Camp`;
}

export function getRegistrationSubject(registrationType?: string): string {
  return registrationType === "sibling"
    ? "Heatherwood Football Camp — Sibling registration received"
    : "Heatherwood Football Camp — Registration received";
}
