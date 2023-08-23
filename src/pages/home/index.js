import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname();
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
