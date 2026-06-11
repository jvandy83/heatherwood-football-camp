import { RegistrationClosed } from "@/components/RegistrationClosed";
import { isRegistrationOpen } from "@/lib/registration";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  if (!isRegistrationOpen()) {
    return <RegistrationClosed title="Register" />;
  }
  return <RegisterForm />;
}
