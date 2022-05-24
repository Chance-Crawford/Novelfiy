import { useQuery } from '@apollo/client';
import { GET_ME, GET_USER } from '../utils/queries';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faFilePen, faHeart } from '@fortawesome/free-solid-svg-icons'

import NovelList from '../components/NovelList'
import PageNotFound from './PageNotFound';

function Profile() {

    const { username: username } = useParams();

    // get user from param
    const { loading: userLoading, data: userData } = useQuery(GET_USER, {
        variables: { username: username }
    });

    const [user, setUser] = useState({});

    useEffect(() => {
        if(userData){
            console.log(userData.user);
            setUser(userData.user);
        } 

    }, [userData, userLoading]);

    // set state of which icon is active
    const [tab, setTab] = useState("Novels");

    // get me
    const { loading, data } = useQuery(GET_ME);

    const [me, setMe] = useState({});

    const [myProfile, setMyProfile] = useState(false);

    useEffect(() => {
        // make sure me has complete data by being as specific as possible.
        if(data?.me.givenReviews){
            // if data has returned fully give me a value
            setMe(data.me)
            if(data.me.username === username){
                setMyProfile(true)
            }
            
        }
    }, [data, loading]);

    return(
        <div>
            { user?.username ? (
                <div>
                    <section className='w-100 p-0 pt-3 pb-3 d-flex flex-wrap justify-content-center'>
                        <div className='w-100'>
                            <h2 className='text-center'>@{user.username}</h2>
                        </div>
                        <div className='w-100 pb-4 mt-3 d-flex justify-content-center flex-wrap light-bottom-border'>
                            <div className='d-flex ml-2 mr-2 justify-content-center flex-wrap text-center'>
                                <div className='w-100'>
                                    <p className='m-0 font-18 bold'>{user.novels.length}</p>
                                </div>
                                <div className='w-100'>
                                    {
                                        user.novels.length === 0 || user.novels.length > 1 ? (
                                            <p className='m-0 font-18'>Novels</p>
                                        ) : (
                                            <p className='m-0 font-18'>Novel</p>
                                        )
                                    }
                                </div>
                            </div>

                            <div className='d-flex ml-2 mr-2 justify-content-center flex-wrap text-center'>
                                <div className='w-100'>
                                    <p className='m-0 font-18 bold'>{user.followingCount}</p>
                                </div>
                                <div className='w-100'>
                                    <p className='m-0 font-18'>Following</p>
                                </div>
                            </div>

                            <div className='d-flex ml-2 mr-2 justify-content-center flex-wrap text-center'>
                                <div className='w-100'>
                                    <p className='m-0 font-18 bold'>{user.followerCount}</p>
                                </div>
                                <div className='w-100'>
                                    <p className='m-0 font-18'>Followers</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='w-100 d-flex justify-content-center light-bottom-border'>
                        <div className='w-75 d-flex flex-wrap justify-content-between text-center'>
                            <div 
                            className={tab === 'Novels' ? 'd-flex justify-content-center w-25 profile-icon active-icon' : 'd-flex profile-icon justify-content-center w-25'}
                            onClick={()=>{setTab('Novels')}}>
                                <h3 className='profile-icon'><FontAwesomeIcon icon={faBook} /></h3>
                            </div>
                            <div 
                            className={tab === 'Reviews' ? 'd-flex justify-content-center w-25 profile-icon active-icon' : 'd-flex profile-icon justify-content-center w-25'}
                            onClick={()=>{setTab('Reviews')}}>
                                <h3 className='profile-icon'><FontAwesomeIcon icon={faFilePen} /></h3>
                            </div>
                            <div 
                            className={tab === 'Favorites' ? 'd-flex profile-icon justify-content-center w-25 active-icon' : 'd-flex profile-icon justify-content-center w-25'}
                            onClick={()=>{setTab('Favorites')}}>
                                <h3><FontAwesomeIcon icon={faHeart} /></h3>
                            </div>
                        </div>
                    </section>
                    <section className='mb-5'>
                        {tab === 'Novels' ? (
                            <div>
                                <div className='mt-4 mb-3'>
                                    <h3>{user.novels.length === 0 || user.novels.length > 1 ? (
                                        <span>Novels</span>
                                    ) : (
                                        <span>Novel</span>
                                    )} by {user.username}</h3>
                                </div>
                                <div className='pt-1'>
                                    {user.novels.length ? (
                                        <NovelList novels={user.novels}></NovelList>
                                    ) : (
                                        <p className='font-18 text-center'>No novels yet</p>
                                    )}
                                    
                                </div>
                            </div>
                        ) : tab === 'Reviews' ? (
                            <div>
                                
                            </div>
                        ) : (
                            <div>
                                
                            </div>
                        )}
                    </section>
                </div>
                
            )  : !userLoading && !user ? (
                // if not loading anymore and there still is no user data.
                <PageNotFound></PageNotFound>
            ) : (
                // if the data is still loading
                <h4 className='text-center'>Loading...</h4>
            )
            }
        </div>
    );
}

export default Profile;