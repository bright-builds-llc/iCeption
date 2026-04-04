const keypadRows = [
  ["AC", "+/-", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

export function CalculatorApp() {
  return (
    <section className="calculator-app">
      <div className="calculator-app__display">0</div>
      <div className="calculator-app__keypad">
        {keypadRows.flatMap((row, rowIndex) =>
          row.map((label) => (
            <button
              className={`calculator-app__key calculator-app__key--${label}`}
              key={`${rowIndex}-${label}`}
              type="button"
            >
              {label}
            </button>
          )),
        )}
      </div>
    </section>
  );
}
