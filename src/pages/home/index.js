import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  return (
    <div>
      <h1>Welcome to Manado Post Admin Web</h1>
    </div>
  );
}
