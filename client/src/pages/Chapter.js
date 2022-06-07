import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { GET_CHAPTER } from '../utils/queries';


function Chapter() {

    const { id: chapterId } = useParams();

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

    return(
        <div>
            {chapter?.novelId?.chapters.every((chap) => chap._id) ? (
                <section>
                    <div className="d-flex align-items-center justify-content-between p-3 light-bottom-border">
                        <div className="d-flex align-items-center">
                            <div className='chapter-novel-img'>
                                <img src={chapter.novelId.imageLink} className="w-100" alt="book cover" />
                            </div>
                            <div className="ml-3">
                                <h2 className="bold">{chapter.novelId.title}</h2>
                                <p className="font-20 ital m-0">{chapter.chapterTitle}</p>
                            </div>
                        </div>
                        <div>
                            <div>
                                {chapter.novelId.penName ? (
                                    <p className='m-0 font-20'>By. <a className='hover-underline' href={`/user/${chapter.novelId.user.username}`}>{chapter.novelId.penName}</a></p>
                                ) : (
                                    <p className='m-0 font-20'>By. <a className='hover-underline' href={`/user/${chapter.novelId.user.username}`}>{chapter.novelId.user.username}</a></p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            ) : loading ? (
                <div>
                    <p className='font-18 text-center'>Loading...</p>
                </div>
            ) : (
                <div></div>
            )}
            
        </div>
    );
}

export default Chapter;