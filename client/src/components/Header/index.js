import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import { useState, useEffect } from 'react';
import { stopSpeechExtra } from '../../utils/helpers';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faUser, faArrowRightFromBracket, faPencil } from '@fortawesome/free-solid-svg-icons'

function Header() {

    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 992px)").matches
    )

    useEffect(() => {
        window
        .matchMedia("(min-width: 992px)")
        .addEventListener('change', e => setMatches( e.matches ));
    }, []);

      
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
            <Link to="/" onClick={stopSpeechExtra}>
                <div>
                    <h1 className="main-title m-0">novelfiy</h1>
                </div>
            </Link>
            {Auth.loggedIn() && me.username ? (
                <div className='d-flex align-items-center'>
                    {matches && (
                        <Link to='/create' onClick={stopSpeechExtra}>
                        <div className='mr-2 write-btn-contain'>
                            <p className='btn m-0 submit-novel'><FontAwesomeIcon icon={faPencil} /> &#160;Submit My Novel</p>
                        </div>
                        </Link>
                    )}
                    {matches && <span className='novel-desc'>|</span>}
                    <div className="dropdown ml-2">
                        <div className='d-flex dropbtn prof-drop'>
                            <div className='avatar-small'>
                                <img className='w-100 user-avatar' src={me.image} alt="user profile picture" />
                            </div>
                            {matches && 
                                <button className="btn ">{me.username} {<FontAwesomeIcon icon={faAngleDown} className="down-arr"/>}</button>
                            }
                            
                        </div>
                        
                        <div className="dropdown-content">
                        <a href={`/user/${me.username}`}><FontAwesomeIcon icon={faUser} className="" /> 	&#160;Profile</a>
                        <a href="/" onClick={logout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} /> &#160;Logout
                        </a>
                        {!matches && (
                            <Link to='/create' onClick={stopSpeechExtra}>
                                <div className=''>
                                    <p className='m-0'><FontAwesomeIcon icon={faPencil} /> &#160;Submit Novel</p>
                                </div>
                            </Link>
                        )}
                        </div>
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