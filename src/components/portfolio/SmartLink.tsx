import type { ReactNode, MouseEvent } from "react";

/** Wraps children in a link only when a URL is present. */
export function SmartLink({
  href,
  className,
  children,
  title,
  onClick,
}: {
  href: string | null | undefined;
  className?: string;
  children: ReactNode;
  title?: string;
  onClick?: (e: MouseEvent) => void;
}) {
  if (!href) return <span className={className}>{children}</span>;
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      title={title}
      className={className}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
