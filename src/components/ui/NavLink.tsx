"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const NavLink = ({
  children,
  href,
  className,
  ActiveClass,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  ActiveClass?: string;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (
    <Link
      href={href}
      className={`${className} ${
        (pathname === href && ActiveClass) ||
        (pathname + "?" + searchParams!.toString() === href && ActiveClass)
      }`}>
      {children}
    </Link>
  );
};

export default NavLink;
