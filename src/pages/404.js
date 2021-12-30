import { useParams, useLocation } from "react-router-dom";

const Missing_page_404 = () => {
  const { pathname } = useLocation();
  return (
    <div>
      Whoops! Looks like the requested url: '{pathname}' does not exist :(
    </div>
  );
};

export default Missing_page_404;
