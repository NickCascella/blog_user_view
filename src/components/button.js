import "../App.css";

const Button = ({ text, on_click }) => {
  return (
    <button className="button-component" onClick={on_click}>
      {text}
    </button>
  );
};

export default Button;
