// Chart utilities for Tremor components
import { clsx } from "clsx";

// Available chart colors
export const AvailableChartColors = [
  "blue",
  "emerald",
  "violet",
  "amber",
  "gray",
  "cyan",
  "pink",
  "lime",
  "fuchsia",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "indigo",
  "purple",
  "rose",
  "sky",
  "slate",
  "zinc",
  "neutral",
  "stone",
];

// Color class mappings
const colorClassMap = {
  blue: {
    bg: "bg-blue-500",
    stroke: "stroke-blue-500",
    fill: "fill-blue-500",
    text: "text-blue-500",
  },
  emerald: {
    bg: "bg-emerald-500",
    stroke: "stroke-emerald-500",
    fill: "fill-emerald-500",
    text: "text-emerald-500",
  },
  violet: {
    bg: "bg-violet-500",
    stroke: "stroke-violet-500",
    fill: "fill-violet-500",
    text: "text-violet-500",
  },
  amber: {
    bg: "bg-amber-500",
    stroke: "stroke-amber-500",
    fill: "fill-amber-500",
    text: "text-amber-500",
  },
  gray: {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  },
  cyan: {
    bg: "bg-cyan-500",
    stroke: "stroke-cyan-500",
    fill: "fill-cyan-500",
    text: "text-cyan-500",
  },
  pink: {
    bg: "bg-pink-500",
    stroke: "stroke-pink-500",
    fill: "fill-pink-500",
    text: "text-pink-500",
  },
  lime: {
    bg: "bg-lime-500",
    stroke: "stroke-lime-500",
    fill: "fill-lime-500",
    text: "text-lime-500",
  },
  fuchsia: {
    bg: "bg-fuchsia-500",
    stroke: "stroke-fuchsia-500",
    fill: "fill-fuchsia-500",
    text: "text-fuchsia-500",
  },
  red: {
    bg: "bg-red-500",
    stroke: "stroke-red-500",
    fill: "fill-red-500",
    text: "text-red-500",
  },
  orange: {
    bg: "bg-orange-500",
    stroke: "stroke-orange-500",
    fill: "fill-orange-500",
    text: "text-orange-500",
  },
  yellow: {
    bg: "bg-yellow-500",
    stroke: "stroke-yellow-500",
    fill: "fill-yellow-500",
    text: "text-yellow-500",
  },
  green: {
    bg: "bg-green-500",
    stroke: "stroke-green-500",
    fill: "fill-green-500",
    text: "text-green-500",
  },
  teal: {
    bg: "bg-teal-500",
    stroke: "stroke-teal-500",
    fill: "fill-teal-500",
    text: "text-teal-500",
  },
  indigo: {
    bg: "bg-indigo-500",
    stroke: "stroke-indigo-500",
    fill: "fill-indigo-500",
    text: "text-indigo-500",
  },
  purple: {
    bg: "bg-purple-500",
    stroke: "stroke-purple-500",
    fill: "fill-purple-500",
    text: "text-purple-500",
  },
  rose: {
    bg: "bg-rose-500",
    stroke: "stroke-rose-500",
    fill: "fill-rose-500",
    text: "text-rose-500",
  },
  sky: {
    bg: "bg-sky-500",
    stroke: "stroke-sky-500",
    fill: "fill-sky-500",
    text: "text-sky-500",
  },
  slate: {
    bg: "bg-slate-500",
    stroke: "stroke-slate-500",
    fill: "fill-slate-500",
    text: "text-slate-500",
  },
  zinc: {
    bg: "bg-zinc-500",
    stroke: "stroke-zinc-500",
    fill: "fill-zinc-500",
    text: "text-zinc-500",
  },
  neutral: {
    bg: "bg-neutral-500",
    stroke: "stroke-neutral-500",
    fill: "fill-neutral-500",
    text: "text-neutral-500",
  },
  stone: {
    bg: "bg-stone-500",
    stroke: "stroke-stone-500",
    fill: "fill-stone-500",
    text: "text-stone-500",
  },
};

// Get color class name
export function getColorClassName(color, type = "bg") {
  return colorClassMap[color]?.[type] || colorClassMap.blue[type];
}

// Construct category colors map
export function constructCategoryColors(categories, colors) {
  const categoryColors = new Map();
  categories.forEach((category, index) => {
    categoryColors.set(
      category,
      colors[index % colors.length]
    );
  });
  return categoryColors;
}

// Get Y-axis domain
export function getYAxisDomain(autoMinValue, minValue, maxValue) {
  const minDomain = autoMinValue ? "dataMin" : minValue ?? 0;
  const maxDomain = maxValue ?? "dataMax";
  return [minDomain, maxDomain];
}

// Check if data has only one value for a key
export function hasOnlyOneValueForKey(data, key) {
  const values = data.map(item => item[key]).filter(value => value !== undefined && value !== null);
  const uniqueValues = [...new Set(values)];
  return uniqueValues.length <= 1;
}

// Deep equal comparison
export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}