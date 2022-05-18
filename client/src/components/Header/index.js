import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';

function Header() {
    const logout = event => {
        // With the event.preventDefault(), override a default nature of loading a  differtent
        // resource, instead call logout method to remove token from local storage.
        event.preventDefault();
        Auth.logout();
    };

    return(
        <header className="top-header p-3 d-flex justify-content-between align-items-center">
            <Link to="/">
                <div>
                    <h1 className="main-title m-0">novelfiy</h1>
                </div>
            </Link>
            {Auth.loggedIn() ? (
                <a href="/" onClick={logout}>
                    <div>
                        <button className="btn login-btn">Logout</button>
                    </div>
                </a>
            ) : (
                <Link to="/login">
                    <div>
                        <button className="btn login-btn">Log in</button>
                    </div>
                </Link>
            )}
            
        </header>
    );
}

export default Header;