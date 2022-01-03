import React, { useEffect, useState } from "react";

const Textarea = ({
  setState,
  state,
  minRowsStart,
  maxRowsStart,
  placeholder,
  additionalOnchange,
}) => {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(minRowsStart || 5);
  const [minRows, setMinRows] = useState(minRowsStart || 5);
  const [maxRows, setMaxRows] = useState(maxRowsStart || 20);

  useEffect(() => {
    setValue(state);
  });

  const handleChange = (e) => {
    const textareaLineHeight = 24;

    const previousRows = e.target.rows;
    e.target.rows = minRows; // reset number of rows in textarea

    const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);

    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    if (currentRows >= maxRows) {
      e.target.rows = maxRows;
      e.target.scrollTop = e.target.scrollHeight;
    }

    setValue(e.target.value);
    setRows(currentRows < maxRows ? currentRows : maxRows);
  };

  return (
    <textarea
      rows={rows}
      value={value}
      className="textarea-component"
      onChange={(e) => {
        handleChange(e);
        setState(e.target.value);
        additionalOnchange(e);
      }}
      placeholder={placeholder || ""}
    ></textarea>
  );
};

export default Textarea;
