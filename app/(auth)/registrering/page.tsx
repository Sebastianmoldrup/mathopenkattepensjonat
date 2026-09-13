import { Suspense } from "react";
import SignUpForm from "@/components/sign-up-form";

const Page = () => {
  return (
    <div className="max-w-md mx-auto py-10">
      <Suspense fallback={null}>
        <SignUpForm />
      </Suspense>
    </div>
  );
};

export default Page;
