import { useQuery } from '@apollo/client';
import { GET_ME, GET_USER } from '../utils/queries';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faFilePen, faHeart, faUserPlus } from '@fortawesome/free-solid-svg-icons'

import NovelList from '../components/NovelList'
import PageNotFound from './PageNotFound';
import ReadMore from '../components/ReadMore';
import FollowButton from '../components/FollowButton';

function Profile() {

    const { username: username } = useParams();

    // get user from param
    const { loading: userLoading, data: userData } = useQuery(GET_USER, {
        variables: { username: username },
    });

    const [user, setUser] = useState({});

    useEffect(() => {
        // !user.favoriteNovels so that user does not automatically update.
        // if there is already a user reference available with all its data populated,
        // use that one until refresh.
        if(userData?.user.favoriteNovels && !user.favoriteNovels){
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
            console.log(data.me);
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
                            <div onClick={()=>{setTab('Novels')}} className='d-flex point ml-2 mr-2 justify-content-center flex-wrap text-center'>
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

                            <div onClick={()=>{setTab('Following')}} className='d-flex ml-2 mr-2 justify-content-center flex-wrap text-center point'>
                                <div className='w-100'>
                                    <p className='m-0 font-18 bold'>{user.followingCount}</p>
                                </div>
                                <div className='w-100'>
                                    <p className='m-0 font-18'>Following</p>
                                </div>
                            </div>

                            <div onClick={()=>{setTab('Followers')}} className='d-flex ml-2 mr-2 justify-content-center flex-wrap text-center point'>
                                <div className='w-100'>
                                    <p className='m-0 font-18 bold'>{user.followerCount}</p>
                                </div>
                                <div className='w-100'>
                                    <p className='m-0 font-18'>Followers</p>
                                </div>
                            </div>
                            <FollowButton user={user}></FollowButton>
                        </div>
                    </section>
                    <section className='w-100 d-flex justify-content-center light-bottom-border'>
                        <div className='w-75 d-flex flex-wrap justify-content-between text-center'>
                            <div 
                            className={tab === 'Novels' ? 'd-flex justify-content-center w-25 profile-icon active-icon' : 'd-flex profile-icon justify-content-center w-25'}
                            onClick={()=>{setTab('Novels')}}>
                                <a title='Novels'><h3 className='profile-icon'><FontAwesomeIcon icon={faBook} /></h3></a>
                            </div>
                            <div 
                            className={tab === 'Reviews' ? 'd-flex justify-content-center w-25 profile-icon active-icon' : 'd-flex profile-icon justify-content-center w-25'}
                            onClick={()=>{setTab('Reviews')}}>
                                <a title='Reviews'><h3 className='profile-icon'><FontAwesomeIcon icon={faFilePen} /></h3></a>
                            </div>
                            <div 
                            className={tab === 'Favorites' ? 'd-flex profile-icon justify-content-center w-25 active-icon' : 'd-flex profile-icon justify-content-center w-25'}
                            onClick={()=>{setTab('Favorites')}}>
                                <a title='Favorites'><h3><FontAwesomeIcon icon={faHeart} /></h3></a>
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
                                <div className='mt-4 mb-3'>
                                    <h3>{user.novels.length === 0 || user.novels.length > 1 ? (
                                        <span>Reviews</span>
                                    ) : (
                                        <span>Review</span>
                                    )} by {user.username}</h3>
                                    <p className='novel-desc'>Novels that {user.username} has reviewed</p>
                                </div>
                                <div className='pt-1'>
                                    {user.givenReviewCount ? (
                                        <div>
                                            {user.givenReviews.map( review => (
                                                <div key={review._id} >
                                                    <div className='novel-box p-3 review-contain'>
                                                        <div>
                                                            <p className='font-18 bold text-center'>Review for: <a className='underline' href={`/novel/${review.novel._id}`}>{review.novel.title}</a></p>
                                                        </div>
                                                        <div className='d-flex justify-content-center mb-2'>
                                                            <div className='cover-div p-3'>
                                                                <img src={review.novel.imageLink} className="w-100" alt="book cover" />
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="d-flex mb-3">
                                                            <a href={`/user/${review.user.username}`}>
                                                                <p className="bold font-17 m-0 user-hover">{review.user.username}</p>
                                                            </a>
                                                            <p className="ml-2 ital font-17 m-0">{review.createdAt}</p>
                                                        </div>
                                                        <div className='w-50 mb-3'>
                                                            <div className={review.rating < 4 ? 'mb-2 review-red' :
                                                                review.rating < 7 ? 'mb-2 review-yellow' :
                                                                'mb-2 review-green'
                                                                }>
                                                                <p className="m-0">Rating: {review.rating}/10</p>
                                                            </div>
                                                        </div>
                                                        
                                                        
                                                        {
                                                            // have to put in a template literal to get it to read length
                                                            // and treat as string
                                                            `${review.reviewText}`.length <= 430 ? (
                                                                <p className="">
                                                                    {/* split review text by the newline characters and make
                                                                    each section a paragraph */}
                                                                    {review.reviewText.split('\n').map(part=>(
                                                                        <span>{part}</span>
                                                                    ))}
                                                                </p>
                                                            ) : (
                                                                <ReadMore text={review.reviewText} length={430}></ReadMore>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='font-18 text-center'>{user.username} has not reviewed any novels yet</p>
                                    )}
                                    
                                </div>
                            </div>
                        ) : tab === 'Favorites' ? (
                            <div>
                                <div className='mt-4 mb-3'>
                                    <h3>Favorite Novels</h3>
                                    <p className='novel-desc'>Novels that have been favorited by {user.username}</p>
                                </div>
                                <div className='pt-1'>
                                    {user.favoriteNovels.length ? (
                                        <div>
                                            <NovelList novels={user.favoriteNovels}></NovelList>
                                        </div>
                                    ) : (
                                        <p className='font-18 text-center'>{user.username} has not added any novels to their favorites</p>
                                    )}
                                </div>
                            </div>
                        ) : tab === 'Following' ? (
                            <div>
                                <div className='mt-4 mb-3'>
                                    <h3>Following</h3>
                                    <p className='novel-desc'>Users that {user.username} follows</p>
                                </div>
                                <div className='pt-1'>
                                    {user.following.length ? (
                                        <div>
                                            {user.following.map( followingUser =>(
                                                <div className="mb-4 pb-1">
                                                    <a href={`/user/${followingUser.username}`} >
                                                    <div className='p-3 novel-box slight-border'>
                                                        <h4 className='bold text-center m-0'>{followingUser.username}</h4>
                                                    </div>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='font-18 text-center'>{user.username} has not followed anybody yet</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className='mt-4 mb-3'>
                                    <h3>Followers</h3>
                                    <p className='novel-desc'>Users that follow {user.username}</p>
                                </div>
                                <div className='pt-1'>
                                    {user.followers.length ? (
                                        <div>
                                            {user.followers.map( followerUser =>(
                                                <div className="mb-4 pb-1">
                                                    <a href={`/user/${followerUser.username}`} className="mb-3">
                                                        <div className='p-3 novel-box slight-border'>
                                                            <h4 className='bold text-center m-0'>{followerUser.username}</h4>
                                                        </div>
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className='font-18 text-center'>{user.username} does not have any followers yet</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
                
            )  : !userLoading && !user ? (
                // if not loading anymore and there still is no user data.
                <PageNotFound></PageNotFound>
            ) : (
                // if the data is still loading
                <div>
                    {
                        
                    }
                    <h4 className='text-center'>Loading...</h4>
                </div>
                
            )
            }
        </div>
    );
}

export default Profile;