// use id from url
import { useParams } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { GET_NOVEL } from '../utils/queries';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

function SingleNovel() {
    const { id: novelId } = useParams();

    const { loading, data } = useQuery(GET_NOVEL, {
        // This is how you can pass variables to queries that need them. 
        // The id property on the variables object will become the $id 
        // parameter in the GraphQL query.
        // This is how you pass in a value to the query's parameter.
        // we put in the value retieved in the thoughtId variable above.
        variables: { _id: novelId }
    });
    const novel = data?.novel || {}

    if (loading) {
        return <h3 className='text-center'>Loading...</h3>;
    }

    return (
        <div className="pb-5">
            <section className='d-flex justify-content-center flex-wrap light-shadow-bottom'>
                <div className='w-50 d-flex flex-wrap justify-content-center align-items-center'>
                    <div className='mt-3 mb-2 w-100'>
                        <h2 className='m-0 bold'>{novel.title}</h2>
                    </div>
                    <div className="mt-3 mb-2 w-100">
                        <p className="m-0">By. <span className="bold">{novel.penName ? novel.penName : novel.user.username}</span></p>
                    </div>
                    <div className="mt-3 mb-2 w-100">
                        <p className="m-0">Reviews: {novel.reviewCount} / Chapters: {novel.chapterCount}</p>
                    </div>
                    <div className="d-flex align-items-center mt-4 mb-4 w-100">
                        <div>
                            <button className="btn read-btn bold">
                                <FontAwesomeIcon icon={faReadme} className="novel-list-icon"/>Read
                            </button>
                        </div>
                        <div>
                            <button className="btn fav-btn bold ml-3">
                            <FontAwesomeIcon icon={faHeart} className="novel-list-icon"/>Add To Favorites
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className='mt-4 pb-3 light-bottom-border'>
                <div className='mb-3'>
                    <h4>@{novel.user.username}</h4>
                </div>
                <div className='mt-4 mb-3'>
                    <h3 className='bold'>Description</h3>
                </div>
                <div>
                <p className="novel-desc">
                    {novel.description}
                </p>
                </div>
            </section>
            <section className='mt-3 p-3'>
                <div className='row justify-content-between'>
                    <article className='novel-article col-12'>
                        <h3>Chapters</h3>
                        <hr />
                    </article>
                    <article className='novel-article col-12'>
                        <h3>Reviews</h3>
                        <hr />
                    </article>
                </div>
            </section>
            <section className='mt-3 mb-4'>
                <h3 className='bold mb-3'>Write A Review</h3>
                <form id='novel-review-form'>
                    <div className='d-flex'>
                        <textarea name="" id="" rows="8" className='review-textarea'></textarea>
                        <button className='btn review-submit-btn'><FontAwesomeIcon icon={faPaperPlane} /></button>
                    </div>
                </form>
            </section>
            
        </div>
    );
}

export default SingleNovel;