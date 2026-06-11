/** Set REGISTRATION_OPEN=true (or 1) to accept new registrations. Closed by default. */
export function isRegistrationOpen(): boolean {
  const v = process.env.REGISTRATION_OPEN;
  return v === "true" || v === "1";
}

export function getRegistrationClosedMessage(): string {
  return (
    process.env.REGISTRATION_CLOSED_MESSAGE ??
    "Registration for this season is closed. Thanks for a great summer — check back next year!"
  );
}
