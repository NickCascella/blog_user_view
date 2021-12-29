import "../App.css";

const Button = ({ text, on_click }) => {
  return (
    <button className="button" onClick={on_click}>
      {text}
    </button>
  );
};

export default Button;
