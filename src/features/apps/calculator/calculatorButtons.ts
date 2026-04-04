import type { CalculatorAction, CalculatorOperator } from "./calculatorState";

export type CalculatorButton = {
  id: string;
  label: string;
  variant: "utility" | "operator" | "digit";
  wide?: boolean;
  action: CalculatorAction;
};

export const calculatorButtons: CalculatorButton[][] = [
  [
    { id: "clear", label: "AC", variant: "utility", action: { kind: "clear" } },
    {
      id: "sign",
      label: "+/-",
      variant: "utility",
      action: { kind: "toggle-sign" },
    },
    {
      id: "percent",
      label: "%",
      variant: "utility",
      action: { kind: "percent" },
    },
    {
      id: "divide",
      label: "÷",
      variant: "operator",
      action: { kind: "operator", value: "÷" as CalculatorOperator },
    },
  ],
  [
    { id: "7", label: "7", variant: "digit", action: { kind: "digit", value: "7" } },
    { id: "8", label: "8", variant: "digit", action: { kind: "digit", value: "8" } },
    { id: "9", label: "9", variant: "digit", action: { kind: "digit", value: "9" } },
    {
      id: "multiply",
      label: "×",
      variant: "operator",
      action: { kind: "operator", value: "×" as CalculatorOperator },
    },
  ],
  [
    { id: "4", label: "4", variant: "digit", action: { kind: "digit", value: "4" } },
    { id: "5", label: "5", variant: "digit", action: { kind: "digit", value: "5" } },
    { id: "6", label: "6", variant: "digit", action: { kind: "digit", value: "6" } },
    {
      id: "subtract",
      label: "−",
      variant: "operator",
      action: { kind: "operator", value: "−" as CalculatorOperator },
    },
  ],
  [
    { id: "1", label: "1", variant: "digit", action: { kind: "digit", value: "1" } },
    { id: "2", label: "2", variant: "digit", action: { kind: "digit", value: "2" } },
    { id: "3", label: "3", variant: "digit", action: { kind: "digit", value: "3" } },
    {
      id: "add",
      label: "+",
      variant: "operator",
      action: { kind: "operator", value: "+" as CalculatorOperator },
    },
  ],
  [
    {
      id: "0",
      label: "0",
      variant: "digit",
      wide: true,
      action: { kind: "digit", value: "0" },
    },
    {
      id: "decimal",
      label: ".",
      variant: "digit",
      action: { kind: "decimal" },
    },
    {
      id: "equals",
      label: "=",
      variant: "operator",
      action: { kind: "equals" },
    },
  ],
];
