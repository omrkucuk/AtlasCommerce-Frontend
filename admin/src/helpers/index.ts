import type { Theme } from "../types/admin";

export function th(dark: boolean): Theme {
  return dark
    ? {
        bg: "bg-[#0f1117]",
        sidebar: "bg-[#1a1d27]",
        card: "bg-[#1e2130]",
        navbar: "bg-[#1a1d27]",
        text: "text-slate-200",
        textMuted: "text-slate-400",
        border: "border-[#2d3148]",
        input: "bg-[#252838] border-[#2d3148] text-slate-200 placeholder-slate-500",
        hover: "hover:bg-[#252838]",
        tableRow: "hover:bg-[#252838]",
        tableHead: "bg-[#252838]",
        divider: "divide-[#2d3148]",
      }
    : {
        bg: "bg-[#f4f5f7]",
        sidebar: "bg-white",
        card: "bg-white",
        navbar: "bg-white",
        text: "text-slate-800",
        textMuted: "text-slate-500",
        border: "border-slate-200",
        input: "bg-white border-slate-200 text-slate-800 placeholder-slate-400",
        hover: "hover:bg-slate-50",
        tableRow: "hover:bg-slate-50",
        tableHead: "bg-slate-50",
        divider: "divide-slate-100",
      };
}
