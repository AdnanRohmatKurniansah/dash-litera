import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./_components/AuthPageLayout";
import SignInForm from "./_components/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign In Dashboard | Litera"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
