import { Link } from 'react-router-dom';

function Header() {

    return(
        <header className="top-header p-3 d-flex justify-content-between align-items-center">
            <div>
                <h1 className="main-title m-0">novelfiy</h1>
            </div>
            <div>
                <button className="btn login-btn">Log in</button>
            </div>
        </header>
    );
}

export default Header;