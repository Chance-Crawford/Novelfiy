import { useQuery } from '@apollo/client';
import { GET_ME_SMALL, GET_NOVEL } from '../utils/queries';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ChangeNovel from '../components/ChangeNovel';
function EditNovel() {

    const { novelId } = useParams();

    // must define novel as a state to use useEffect correctly
    const [novel, setNovel] = useState({});

    const { loading, data } = useQuery(GET_NOVEL, {
        variables: { _id: novelId }
    });

    // use effect ensures that all novel data is completely loaded
    // before rendering the SingleNovel page
    useEffect(() => {
        console.log(data?.novel);
        // if there's data to be stored
        // make sure novel is not already set. because if not the novel
        // will be set again without the user.username.
        if (!novel.title && data?.novel.reviews.every((review) => review.rating)) {
            setNovel(data.novel) 
            
        }
    }, [data, loading]);

    const { loading: meLoading, data: myData } = useQuery(GET_ME_SMALL);

    const [me, setMe] = useState({});

    const [myNovel, setMyNovel] = useState(false);

    useEffect(() => {
        // make sure me has complete data by being as specific as possible.
        if(myData?.me._id){
            setMe(myData.me)
            
            if(myData.me._id === novel.user?._id){
                setMyNovel(true)
            }
            
        }
    }, [myData, meLoading, novel]);

    return(
        <div>
            {myNovel ? (
                <ChangeNovel novel={novel}></ChangeNovel>
            ) : loading || meLoading ? (
                <div></div>
            ) : !novel._id ? (
                <h2 className='mt-4 text-center'>Novel could not be found</h2>
            ) : (
                <div className='text-center mt-4'>
                    <h4 className='bold'>ACCESS RESTRICTED</h4>
                    <p className='font-18'>Please log into the correct account to edit this 
                    novel</p>
                </div>
            )}
        </div>
    );
}

export default EditNovel;