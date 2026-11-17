import Link from "next/link";
import type { RenderLink } from "@meduza/ui";

/** Plugs client-side navigation into the design-system NavBar and TabBar. */
export const renderLink: RenderLink = ({ href, children, ...rest }) => (
  <Link href={href} {...rest}>
    {children}
  </Link>
);
