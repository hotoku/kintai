import { Link } from "react-router-dom";

import Style from "./Header.module.css";

const Header = (): JSX.Element => {
  return (
    <header className={Style.header}>
      <Link className={Style.link} to="/">
        home
      </Link>
      <Link className={Style.link} to="/clients">
        clients
      </Link>
      <Link className={Style.link} to="/deals">
        deals
      </Link>
    </header>
  );
};

export default Header;
