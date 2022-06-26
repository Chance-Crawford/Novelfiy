import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { ADD_COMMENT } from '../../utils/mutations';

import ReadMore from "../ReadMore";
import randomId from "../../utils/randomId";

function CommentSection({ chapter }) {

    // Add comment
    const [commentForm, setCommentForm] = useState({commentText: '', chapter: chapter._id});

    const [addComment, { error }] = useMutation(ADD_COMMENT, {
        onCompleted: (data) => console.log(data),
    });

    const handleCommentChange = (event) => {
        let { value } = event.target;
    
        setCommentForm({
            ...commentForm,
            commentText: value.replace(/ +/g, ' ').trim()
        });
    };
    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        try {
            await addComment({
                variables: { ...commentForm }
            });

            window.location.assign(`/chapter/${chapter._id}`)
        } 
        catch (e) {
            console.log(error?.message)
            console.error(e);
            return;
        }
    }
    console.log(commentForm)
    return ( 
        <section className='p-3 mt-4'>
            <div>
                <h3 className='bold'>Comments ({chapter.comments.length})</h3>
            </div>
            <div>
                <form onSubmit={handleCommentSubmit} className='mt-4 w-75 d-flex align-items-center flex-wrap'>
                    <div className='w-75'>
                        <textarea onChange={handleCommentChange} className='w-100 p-2 font-18' name="commentText" id="commentText" rows="5"></textarea>
                    </div>
                    <div>
                        <button type="submit" className='btn review-submit-btn'><FontAwesomeIcon icon={faPaperPlane} /></button>
                    </div>
                </form>
            </div>
            {/* comment list */}
            <div className='mt-4 mb-5'>
                {chapter.chapterTitle && chapter.comments.map(comment=>(
                    <div key={comment._id} className='p-3 light-top-bottom font-18 d-flex'>  
                        <div className='avatar-small mr-2 pt-1'>
                            <a href={`/user/${comment.user.username}`}>
                                <img className='w-100 user-avatar' src={comment.user.image} alt="user profile picture" />
                            </a>
                        </div>
                        <div className='w-100'>
                            <div>
                                <a href={`/user/${comment.user.username}`} className='m-0 bold user-hover'>{comment.user.username}</a>
                                <p className='m-0 novel-desc font-reg ital'>{comment.createdAt}</p>
                            </div>
                            <div className='mt-2 text-over'>
                                {
                                    `${comment.commentText}`.length <= 430 ? (
                                        <div className="">
                                            {/* split review text by the newline characters and make
                                            each section a paragraph */}
                                            {comment.commentText.split('\n').map(part=>(
                                                <p className='m-0' key={randomId(10)}>{part}</p>
                                            ))}
                                        </div>
                                    ) : (
                                        <ReadMore text={comment.commentText} length={430}></ReadMore>
                                    )
                                }
                            </div>
                        </div>   
                    </div>
                ))}
            </div>
        </section>
     );
}

export default CommentSection;