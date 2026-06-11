import { RegistrationClosed } from "@/components/RegistrationClosed";
import { isRegistrationOpen } from "@/lib/registration";
import PayOnlyForm from "./PayOnlyForm";

export default function PayOnlyPage() {
  if (!isRegistrationOpen()) {
    return <RegistrationClosed title="Complete payment" />;
  }
  return <PayOnlyForm />;
}
