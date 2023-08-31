import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const user = { name: "John Doe" };

  useEffect(() => {
    if (user) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, []);
}
