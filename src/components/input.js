const Input = ({ type, placeholder, value, on_change }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={on_change}
      value={value}
    ></input>
  );
};

export default Input;
