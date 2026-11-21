
import React, { useState, useEffect } from "react";
import "./Calculator.css";

function Calculator() {
  const [display, setDisplay] = useState("");

  const handleClick = (value) => {
    setDisplay((prev) => prev + value);
  };

  const clearDisplay = () => {
    setDisplay("");
  };

  const backspace = () => {
    setDisplay((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    try {
      if (!display || !/^[0-9+\-*/.()\s]+$/.test(display)) {
        throw new Error("Invalid input");
      }

      const result = Function(
        '"use strict"; return (' + display + ')'
      )();

      if (!Number.isFinite(result)) {
        throw new Error("Invalid calculation");
      }

      setDisplay(String(result));
    } catch {
      setDisplay("Error");
    }
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (/^[0-9.]$/.test(key) || ["+", "-", "*", "/"].includes(key)) {
        handleClick(key);
      } else if (key === "Enter") {
        event.preventDefault();
        calculate();
      } else if (key === "Backspace") {
        backspace();
      } else if (key === "Escape") {
        clearDisplay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [display]);

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+",
  ];

  return (
    <div className="calculator">
      <h2>React Calculator</h2>

      <input
        type="text"
        value={display}
        readOnly
        className="display"
        placeholder="0"
      />

      <div className="buttons">
        {buttons.map((item) => (
          <button
            key={item}
            onClick={() =>
              item === "=" ? calculate() : handleClick(item)
            }
          >
            {item}
          </button>
        ))}

        <button className="delete" onClick={backspace}>
          DEL
        </button>

        <button className="clear" onClick={clearDisplay}>
          C
        </button>
      </div>
    </div>
  );
}

export default Calculator;
