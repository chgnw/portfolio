import Image, { type ImageProps } from "next/image";
import { PLACEHOLDER_IMAGE } from "@/lib/content/registry";

/** next/image wrapper: falls back to the placeholder and skips optimisation for absolute URLs. */
export function Img({ src, alt, ...rest }: Omit<ImageProps, "src"> & { src: string | null | undefined }) {
  const url = src || PLACEHOLDER_IMAGE;
  return <Image src={url} alt={alt} unoptimized={/^https?:\/\//.test(url)} {...rest} />;
}
