import { useState } from 'react';
import { ADD_CHAPTER } from '../../utils/mutations';
import { useMutation } from '@apollo/client';

function ChapterEditor({ novel }) {

    const [chapterForm, setChapterForm] = useState({chapterTitle: 'Chapter 00 - New Chapter', chapterText: ''});

    const [addChapter, { error }] = useMutation(ADD_CHAPTER, {
        onCompleted: (data) => console.log(data),
    });

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
            await addChapter({
                variables: { ...chapterForm, novelId: novel._id }
            });

            window.location.assign(`/novel/${novel._id}`)
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
                <div className="d-flex align-items-center flex-wrap justify-content-between p-3 light-bottom-border">
                    <div className="d-flex align-items-center">
                        <div className='chapter-novel-img'>
                            <img src={novel.imageLink} className="w-100" alt="book cover" />
                        </div>
                        <div className="ml-3">
                            <h2 className="bold">{novel.title}</h2>
                            <p className="font-20 ital m-0">{chapterForm.chapterTitle}</p>
                        </div>
                    </div>
                    <div className='chapter-publish-btn-contain'>
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
            <div className='chapter-editor-contain'>
                <section className="mt-3">
                    <div className="w-100">
                        <input onChange={handleChapterTitleChange} className="w-100 chapter-input font-20" type="text" placeholder="Chapter 00 - New Chapter" />
                    </div>
                </section>
                <section className="mt-3 mb-3">
                    <div className='w-100'>
                        <textarea onChange={handleChapterTextChange} className='font-18 chapter-textarea' placeholder='Chapter text...'></textarea>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ChapterEditor;