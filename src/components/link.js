import { Link } from "react-router-dom";

const Custom_Link = ({ text, route, on_click }) => {
  return (
    <Link className="link" to={route} onClick={on_click}>
      {text}
    </Link>
  );
};

export default Custom_Link;
