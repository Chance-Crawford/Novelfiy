import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useQuery } from '@apollo/client';
import { GET_CHAPTER } from '../utils/queries';
import randomId from '../utils/randomId'
import PlayText from '../components/PlayText';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

function Chapter() {

    const { id: chapterId } = useParams();

    const [chapter, setChapter] = useState({});
    const [prevChapter, setPrevChapter] = useState('');
    const [nextChapter, setNextChapter] = useState('');

    const { loading, data } = useQuery(GET_CHAPTER, {
        variables: { _id: chapterId }
    });

    // use effect ensures that all novel data is completely loaded
    // before rendering the SingleNovel page
    useEffect(() => {
        console.log(data?.chapter);
        if (!chapter.chapterTitle && data?.chapter.novelId.chapters.every((chap) => chap._id)) {
            setChapter(data.chapter) 
            // get index of novel in the chapters array by finding the chapter in the array
            // by its ID
            let chapters = data.chapter.novelId.chapters;
            const index = chapters.map( chap => chap._id).indexOf(chapterId);
            // if this is not the first chapter
            if(index > 0){
                setPrevChapter(chapters[index - 1]._id)
            }
            // if this is not the last chapter
            if(index < chapters.length - 1){
                setNextChapter(chapters[index + 1]._id)
            }
            
        }
    }, [data, loading]);

    

    return(
        <div className='chap-div'>
            {chapter?.novelId?.chapters.every((chap) => chap._id) ? (
                <div className='h-100'>
                    <section>
                        <div className="d-flex align-items-center justify-content-between p-3 light-bottom-border">
                            <div className="d-flex align-items-center">
                                <div className='chapter-novel-img'>
                                    <img src={chapter.novelId.imageLink} className="w-100" alt="book cover" />
                                </div>
                                <div className="ml-3">
                                    <h2 className="bold">{chapter.novelId.title}</h2>
                                    {/* chapter dropdown menu */}
                                    <div className="dropdown">
                                        <button className="dropbtn">{chapter.chapterTitle} &nbsp;{<FontAwesomeIcon icon={faAngleDown} className="down-arr"/>}</button>
                                        <div className="dropdown-content w-100">
                                            {chapter?.novelId?.chapters && chapter.novelId.chapters.map(chap => (
                                                <a key={randomId(10)} className='' href={`/chapter/${chap._id}`}>{chap.chapterTitle}</a>
                                            ))}
                                        </div>
                                    </div>
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
                    <PlayText chapter={chapter}></PlayText>
                    <section>
                        <div className='font-18 p-3'>
                            {chapter.chapterText.split('\n').map(part=>(
                                <p key={randomId(10)}>{part}</p>
                            ))
                            }
                        </div>
                    </section>
                    <section className='p-3 d-flex justify-content-between mt-5'>
                        <div>
                            {prevChapter && (
                                <a href={`/chapter/${prevChapter}`}>
                                    <button className='btn chap-btns'>Previous Chapter</button>
                                </a> 
                            )}
                        </div>
                        <div>
                            {nextChapter && (
                                <a href={`/chapter/${nextChapter}`}>
                                    <button className='btn chap-btns'>Next Chapter</button>
                                </a>
                            )}
                        </div>
                    </section>
                </div>
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