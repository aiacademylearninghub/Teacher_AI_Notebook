import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={props.width || "1.5rem"}
      height={props.height || "1.5rem"}
      {...props}
    >
      <path fill="hsl(var(--foreground))" d="M215.3 40.7A8 8 0 0 0 208 40H48a8 8 0 0 0-7.3 4.7 8 8 0 0 0 .8 8.6L80 104v88a8 8 0 0 0 16 0v-48h64v48a8 8 0 0 0 16 0V104l38.5-50.7a8 8 0 0 0 .8-8.6Z" />
      <path fill="hsl(var(--primary))" d="M160 144H96a8 8 0 0 0-8 8v40a8 8 0 0 0 16 0v-32h48v32a8 8 0 0 0 16 0v-40a8 8 0 0 0-8-8Z" />
    </svg>
  );
}
