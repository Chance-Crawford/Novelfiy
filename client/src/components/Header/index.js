import { Link } from 'react-router-dom';

function Header() {

    return(
        <header className="top-header p-3 d-flex justify-content-between align-items-center">
            <Link to="/">
                <div>
                    <h1 className="main-title m-0">novelfiy</h1>
                </div>
            </Link>
            <Link to="/login">
                <div>
                    <button className="btn login-btn">Log in</button>
                </div>
            </Link>
        </header>
    );
}

export default Header;