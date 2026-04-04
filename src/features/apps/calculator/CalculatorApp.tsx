import { useReducer } from "react";
import { calculatorButtons } from "./calculatorButtons";
import {
  initialCalculatorState,
  reduceCalculatorState,
} from "./calculatorState";

export function CalculatorApp() {
  const [state, dispatch] = useReducer(
    reduceCalculatorState,
    initialCalculatorState,
  );

  return (
    <section className="calculator-app">
      <div className="calculator-app__display">{state.display}</div>
      <div className="calculator-app__keypad">
        {calculatorButtons.flatMap((row, rowIndex) =>
          row.map((button) => (
            <button
              className={`calculator-app__key calculator-app__key--${button.variant}${button.wide ? " calculator-app__key--wide" : ""}`}
              key={`${rowIndex}-${button.id}`}
              onClick={() => {
                dispatch(button.action);
              }}
              type="button"
            >
              {button.label}
            </button>
          )),
        )}
      </div>
    </section>
  );
}
