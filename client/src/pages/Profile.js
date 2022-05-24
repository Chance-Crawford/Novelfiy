import { useQuery } from '@apollo/client';
import { GET_ME, GET_USER } from '../utils/queries';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
                    <section className='w-100 p-3 d-flex flex-wrap justify-content-center'>
                        <div className='w-100'>
                            <h2 className='text-center'>@{user.username}</h2>
                        </div>
                        <div className='w-100 pb-4 mt-3 d-flex justify-content-center flex-wrap light-bottom-border'>
                            <div className='d-flex ml-3 justify-content-center flex-wrap text-center'>
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

                            <div className='d-flex ml-3  justify-content-center flex-wrap text-center'>
                                <div className='w-100'>
                                    <p className='m-0 font-18 bold'>{user.followingCount}</p>
                                </div>
                                <div className='w-100'>
                                    <p className='m-0 font-18'>Following</p>
                                </div>
                            </div>

                            <div className='d-flex ml-3 justify-content-center flex-wrap text-center'>
                                <div className='w-100'>
                                    <p className='m-0 font-18 bold'>{user.followerCount}</p>
                                </div>
                                <div className='w-100'>
                                    <p className='m-0 font-18'>Followers</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section>
                        
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