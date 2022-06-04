import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import { TOGGLE_ADD_TO_FOLLOWING } from '../../utils/mutations';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

function FollowButton({user}) {

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
            if(data.me.username === user.username){
                setMyProfile(true)
            }
            
        }
    }, [data, loading]);

    // toggle follow button for the user
    const [toggleFollow, { error }] = useMutation(TOGGLE_ADD_TO_FOLLOWING);

    const [follow, setFollow] = useState(false);

    const handleToggleFollow = async (event) => {
        setFollow(!follow);

        try {
            const userObj = await toggleFollow({
                variables: { userId: user._id}
            });

            console.log(userObj.data);
        } 
        catch (e) {
            console.error(e);
            return;
        }
    }

    // once me was declared a value in the useEffect above. this will activate
    useEffect(() => {
        // make sure me has data.
        if(me.username){
            console.log(me)
            // when me changes and has data.
            if(me.following.some(userSearch => userSearch._id === user._id)){
                setFollow(true);
            }
        }
    }, [me]);

    return(
        <div className='w-100 d-flex justify-content-center mt-4'>
            {!myProfile && me.username ? (
                <div onClick={handleToggleFollow}>
                    {follow ? (
                        <button className='btn font-18 bold follow-btn following-color'>Following</button>
                    ) : (
                        <button className="btn font-18 bold follow-btn"><FontAwesomeIcon icon={faUserPlus} className="" /> &nbsp;Follow</button>
                    )}
                
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}

export default FollowButton;