import { useQuery } from '@apollo/client';
import { GET_ME_SMALL, GET_USER } from '../utils/queries';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ChangeAvatar from '../components/ChangeAvatar';

function EditAvatar() {
    const { username } = useParams();

    const [user, setUser] = useState({});

    const { loading, data } = useQuery(GET_USER, {
        variables: { username: username }
    });

    useEffect(() => {
        console.log(data?.user);
        if (!user._id && data?.user.username && data?.user._id) {
            setUser(data.user);
        }
    }, [data, loading]);

    // me to make sure there is correct authorization
    const { loading: meLoading, data: myData } = useQuery(GET_ME_SMALL);

    const [myAvatar, setMyAvatar] = useState(false);

    useEffect(() => {
        if(myData?.me._id){
            if(myData.me._id === user?._id){
                setMyAvatar(true);
            }
        }
    }, [myData, meLoading, user]);

    return ( 
        <section>
            {myAvatar ? (
                <ChangeAvatar user={user}></ChangeAvatar>
            ) : loading || meLoading ? (
                <div></div>
            ) : !user._id ? (
                <h2 className='mt-4 text-center'>User could not be found</h2>
            ) : (
                <div className='text-center mt-4'>
                    <h4 className='bold'>ACCESS RESTRICTED</h4>
                    <p className='font-18'>Please log into the correct account to edit this 
                    Profile Picture</p>
                </div>
            )}
        </section>
     );
}

export default EditAvatar;