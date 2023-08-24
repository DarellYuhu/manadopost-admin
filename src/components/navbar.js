import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { title: "Home", href: "/home" },
  { title: "Ads", href: "/ads" },
  { title: "Marketplace", href: "/marketplace" },
  { title: "Lottery", href: "/lottery" },
  { title: "News", href: "/news" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className="bg-gray-800 text-white w-64 h-screen p-4 sticky">
      <h1 className="text-2xl font-semibold mb-4">ManadoPost</h1>
      <div className="flex flex-col">
        {navLinks.map((link, index) => {
          const isActive = link.href === pathname;
          return (
            <Link
              href={link.href}
              key={index}
              className={isActive && "text-yellow-300"}
            >
              {link.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
