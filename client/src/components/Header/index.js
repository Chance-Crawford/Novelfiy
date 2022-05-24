import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faUser, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

function Header() {
    const { loading, data } = useQuery(GET_ME);

    const [me, setMe] = useState({});

    useEffect(() => {
        // make sure me has complete data by being as specific as possible.
        if(data?.me.givenReviews){
            // if data has returned fully give me a value
            setMe(data.me)
        }
    }, [data, loading]);

    const logout = event => {
        // With the event.preventDefault(), override a default nature of loading a  differtent
        // resource, instead call logout method to remove token from local storage.
        event.preventDefault();
        Auth.logout();
    };

    return(
        <div>
            <header className="top-header p-3 d-flex justify-content-between align-items-center">
            <Link to="/">
                <div>
                    <h1 className="main-title m-0">novelfiy</h1>
                </div>
            </Link>
            {Auth.loggedIn() && me.username ? (

                <div class="dropdown">
                    <button class="dropbtn">{me.username} {<FontAwesomeIcon icon={faAngleDown} className="down-arr"/>}</button>
                    <div class="dropdown-content">
                    <a href={`/user/${me.username}`}><FontAwesomeIcon icon={faUser} className="" /> 	&#160;Profile</a>
                    <a href="/" onClick={logout}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} /> &#160;Logout
                    </a>
                    </div>
                </div>
                
            ) : (
                <Link to="/login">
                    <div>
                        <button className="btn login-btn">Log in</button>
                    </div>
                </Link>
            )}
            
            </header>
        </div>
    );
}

export default Header;