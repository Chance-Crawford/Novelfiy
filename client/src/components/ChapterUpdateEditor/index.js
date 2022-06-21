import { useState } from 'react';
import { ADD_CHAPTER } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

import { UPDATE_CHAPTER } from '../../utils/mutations';

function ChapterUpdateEditor({ novel, chap, handleRemove }) {

    const [chapterForm, setChapterForm] = useState({chapterTitle: chap.chapterTitle, chapterText: chap.chapterText});

    const [updateChapter, { error }] = useMutation(UPDATE_CHAPTER, {
        onCompleted: (data) => console.log(data),
    });
    console.log(novel);

    const handleChapterTitleChange = (event) => {
        // get name and value of input element from the event.target
        let { value } = event.target;
    
        setChapterForm({
            ...chapterForm,
            chapterTitle: value.replace(/ +/g, ' ').trim()
        });
    };
    const handleChapterTextChange = (event) => {
        // get name and value of input element from the event.target
        let { value } = event.target;
    
        setChapterForm({
            ...chapterForm,
            chapterText: value.replace(/ +/g, ' ').trim()
        });
    };
    const handleChapterSubmit = async (event) => {
        event.preventDefault();


        try {
            await updateChapter({
                variables: { ...chapterForm, chapterId: chap._id }
            });

            window.location.assign(`/chapter/${chap._id}`);
        } 
        catch (e) {
            console.log(error?.message)
            console.error(e);
            return;
        }


    }

    console.log(chapterForm);

    return(
        <div>
            <section>
                <div className="d-flex align-items-center justify-content-between p-3 light-bottom-border">
                    <div className="d-flex align-items-center">
                        <div className='chapter-novel-img'>
                            <img src={novel.imageLink} className="w-100" alt="book cover" />
                        </div>
                        <div className="ml-3">
                            <h2 className="bold">{novel.title}</h2>
                            <p className="font-20 ital m-0">{chapterForm.chapterTitle}</p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <button onClick={handleChapterSubmit} className="btn font-20 bold publish-btn">Publish</button>
                        </div>
                    </div>
                </div>
                {error && error.message.includes('chapterText') && error.message.includes('must') ? (
                    <div>
                        <p className='err-text bold text-center'>You must have text for this chapter!</p>
                    </div>
                ) :
                error && error.message.includes('chapterTitle') && error.message.includes('must') ? (
                    <div>
                        <p className='err-text bold text-center'>You must have a title for this chapter!</p>
                    </div>
                ) : 
                error ? (
                    <div>
                        <p className='err-text bold text-center'>Could not upload chapter. Please try again later.</p>
                    </div>
                ) : (
                    <div></div>
                )}
            </section>
            <section className="mt-3">
                <div className="w-100">
                    <input onChange={handleChapterTitleChange} className="w-100 chapter-input font-20" type="text" defaultValue={chap.chapterTitle} />
                </div>
            </section>
            <section className="mt-3 mb-3">
                <div className='w-100'>
                    <textarea onChange={handleChapterTextChange} className='font-18 chapter-textarea' defaultValue={chap.chapterText}></textarea>
                </div>
            </section>
        </div>
    );
}

export default ChapterUpdateEditor;