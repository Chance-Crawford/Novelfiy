import { useQuery, useMutation } from '@apollo/client';
import { GET_ME_SMALL, GET_NOVEL } from '../utils/queries';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GET_CHAPTER } from '../utils/queries';


import ChapterUpdateEditor from '../components/ChapterUpdateEditor';

function EditChapter() {
    // chapter
    const { chapterId } = useParams();

    const [chapter, setChapter] = useState({});
    
    const { loading, data } = useQuery(GET_CHAPTER, {
        variables: { _id: chapterId }
    });

    // use effect ensures that all novel data is completely loaded
    // before rendering the SingleNovel page
    useEffect(() => {
        console.log(data?.chapter);
        if (!chapter.chapterTitle && data?.chapter.novelId.chapters.every((chap) => chap._id)) {
            setChapter(data.chapter)    
        }
    }, [data, loading]);

    // me
    const { loading: meLoading, data: myData } = useQuery(GET_ME_SMALL);

    const [me, setMe] = useState({});

    const [myNovel, setMyNovel] = useState(false);

    useEffect(() => {
        // make sure me has complete data by being as specific as possible.
        if(myData?.me._id){
            setMe(myData.me)
            
            if(myData.me._id === chapter?.novelId?.user._id){
                setMyNovel(true)
            }
            
        }
    }, [myData, meLoading, chapter]);

    return(
        <div>
            {myNovel ? (
                <ChapterUpdateEditor novel={chapter.novelId} chap={chapter}></ChapterUpdateEditor>
            ) : loading || meLoading ? (
                <div></div>
            ) : !chapter.novelId.user._id ? (
                <h2 className='mt-4 text-center'>Novel could not be found</h2>
            ) : (
                <div className='text-center mt-4'>
                    <h4 className='bold'>ACCESS RESTRICTED</h4>
                    <p className='font-18'>Please log into the correct account to post a new
                    chapter to this novel</p>
                </div>
            )}
        </div>
    );
}

export default EditChapter;