import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
// Alias for cn function (used in Tremor components)
export const cx = cn;

// Focus input styles
export const focusInput = [
  "focus:ring-2",
  "focus:ring-blue-200",
  "focus:border-blue-500",
  "dark:focus:ring-blue-800/25",
  "dark:focus:border-blue-400",
];

// Error input styles
export const hasErrorInput = [
  "ring-2",
  "ring-red-200",
  "border-red-500",
  "dark:ring-red-800/25",
  "dark:border-red-400",
];

// Focus ring styles
export const focusRing = [
  "outline-hidden",
  "focus-visible:outline",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-blue-500",
];

// Disabled styles
export const disabled = [
  "disabled:pointer-events-none",
  "disabled:opacity-50",
  "disabled:shadow-none",
];

// Button base styles
export const buttonVariants = {
  primary: [
    "bg-blue-600",
    "text-white",
    "hover:bg-blue-700",
    "focus:ring-blue-500",
    "dark:bg-blue-600",
    "dark:hover:bg-blue-700",
  ],
  secondary: [
    "bg-gray-100",
    "text-gray-900",
    "hover:bg-gray-200",
    "focus:ring-gray-500",
    "dark:bg-gray-800",
    "dark:text-gray-100",
    "dark:hover:bg-gray-700",
  ],
  destructive: [
    "bg-red-600",
    "text-white",
    "hover:bg-red-700",
    "focus:ring-red-500",
    "dark:bg-red-600",
    "dark:hover:bg-red-700",
  ],
  outline: [
    "border",
    "border-gray-300",
    "bg-white",
    "text-gray-900",
    "hover:bg-gray-50",
    "focus:ring-gray-500",
    "dark:border-gray-700",
    "dark:bg-gray-950",
    "dark:text-gray-100",
    "dark:hover:bg-gray-800",
  ],
  ghost: [
    "text-gray-900",
    "hover:bg-gray-100",
    "focus:ring-gray-500",
    "dark:text-gray-100",
    "dark:hover:bg-gray-800",
  ],
};

// Size variants
export const sizeVariants = {
  sm: ["h-8", "px-3", "text-sm"],
  md: ["h-9", "px-4", "text-sm"],
  lg: ["h-10", "px-6", "text-base"],
  xl: ["h-11", "px-8", "text-base"],
};

// Format date utility
export function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(new Date(date));
}

// Format number utility
export function formatNumber(number, options = {}) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    ...options,
  }).format(number);
}

// Debounce utility
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle utility
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
