const Button = ({ text, on_click }) => {
  return <button onClick={on_click}>{text}</button>;
};

export default Button;
