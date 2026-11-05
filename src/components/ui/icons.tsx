import type { ReactNode, SVGProps } from "react";

/** Small original drawings for this menu. Labels belong to the surrounding control by default. */
function icon(drawing: ReactNode) {
  return function MenuIcon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={props["aria-label"] || props["aria-labelledby"] ? undefined : true}
        focusable="false"
        {...props}
      >
        {drawing}
      </svg>
    );
  };
}

export const UtensilsCrossed = icon(
  <>
    <g transform="rotate(-40 12 12)">
      <path d="M7 2.5v5.5a2 2 0 0 0 4 0V2.5M9 2.5v19" />
    </g>
    <g transform="rotate(40 12 12)">
      <path d="M15 21.5v-10h-2V6a6 6 0 0 1 2-3.5v9" />
    </g>
  </>,
);
export const Moon = icon(<path d="M17.5 4a8.7 8.7 0 1 0 2.7 13.8A9.2 9.2 0 0 1 17.5 4Z" />);
export const Leaf = icon(
  <>
    <path d="M4 17.5C1 7 10 4 20.5 3.5 20 14 17 21 7 19M3 21 15.5 8.5M10 14v-4M10 14h4" />
  </>,
);
export const Beef = icon(
  <>
    <path d="M3.5 14C2 8.5 7 3 12.5 3.5c4.5.5 4 4.5 7 6.5 3.5 3 1 10-3 10.5-4.5.5-11-1.5-13-6.5Z" />
    <ellipse cx="10" cy="11" rx="3" ry="2.5" transform="rotate(-25 10 11)" />
    <path d="m15.5 15 2 1" />
  </>,
);
export const Grid3X3 = icon(
  <>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1" />
    <path d="M9 3.5v17m6-17v17M3.5 9h17m-17 6h17" />
  </>,
);
export const ChevronDown = icon(<path d="m5.5 9 6.5 6 6.5-6" />);
export const Sun = icon(
  <>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2.5v2m0 15v2M2.5 12h2m15 0h2M5.3 5.3l1.4 1.4m10.6 10.6 1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </>,
);
export const Monitor = icon(
  <>
    <rect x="2.5" y="3.5" width="19" height="13" rx="1.5" />
    <path d="M8 21h8m-4-4.5V21" />
  </>,
);
export const ArrowLeft = icon(<path d="M20 12H4m6-6-6 6 6 6" />);
export const Calendar = icon(
  <>
    <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
    <path d="M8 2.5v5m8-5v5M3.5 10h17M8 14h2m4 0h2m-8 4h2" />
  </>,
);
