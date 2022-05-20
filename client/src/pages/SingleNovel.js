// use id from url
import { useParams } from 'react-router-dom';
import { useState } from 'react';

import ReviewList from '../components/ReviewList';

import { useQuery } from '@apollo/client';
import { GET_NOVEL } from '../utils/queries';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { ADD_REVIEW } from '../utils/mutations';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { faHeart, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

function SingleNovel() {
    const { id: novelId } = useParams();

    // adding error for if user does not fil out the review form
    const [reviewFormError, setReviewFormError] = useState("");

    // review form state
    const [reviewFormState, setReviewFormState] = useState({ reviewText: '', rating: '' });
    // instead of error. Use the review form error state above
    // use error for whenever the review is more than 10000 characters
    const [addReview, { error }] = useMutation(ADD_REVIEW);
    const handleReviewChange = (event) => {
        // get name and value of input element from the event.target
        let { name, value } = event.target;

        // if it is the rating dropdown, make the string a number
        if(name === 'rating'){
            value = parseInt(value);
        }

        if(name === 'reviewText'){
            value = value.trim();
        }
    
        setReviewFormState({
          ...reviewFormState,
          [name]: value,
        });
    };
    console.log(reviewFormState);
    const handleReviewFormSubmit = async (event) => {
        event.preventDefault();

        // reset error catching state
        setReviewFormError("");

        // if no rating was ever selected
        if(!reviewFormState.rating){
            setReviewFormError("Please select a rating to submit your review!")
            throw new Error('No rating selected.')
        }

        // if no text was ever input to review form
        if(!reviewFormState.reviewText){
            setReviewFormError("Please enter text for the review!")
            throw new Error('No text entered.')
        }

        try {
            await addReview({
                // pass in variable data from state and also the novel id
                // from url
                variables: { ...reviewFormState, novel: novelId }
            });

            // refresh page to reset values.
            window.location.reload();
        } 
        catch (e) {
            console.error(e);
            return;
        }
    };

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
                    {novel.reviews.length > 10 && (
                        <div className="mt-3 mb-2 w-100">
                            <p className="m-0 bold font-18">Rating: {
                                (novel.reviews.reduce((total, review)=>{
                                    return total + review.rating
                                }, 0) / novel.reviews.length).toFixed(2)
                            } / 10
                            </p>
                        </div>
                    )}
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
                    {novel.description.split('\n').map(part=>(
                            <p>{part}</p>
                        ))
                    }
                </p>
                </div>
            </section>
            <section className='mt-3 p-3'>
                <div className='row justify-content-between'>
                    <article className='novel-article col-12'>
                        <h3>Chapters</h3>
                        <hr />
                        <div>
                            <p className='mt-3 font-18'>No chapters have been released yet.</p>
                        </div>
                    </article>
                    <article className='novel-article col-12'>
                        <h3>Reviews</h3>
                        <hr className='mb-0'/>
                        { novel.reviewCount ? (<ReviewList reviews={novel.reviews}></ReviewList>) : (
                          <div>
                              <p className='mt-3 font-18'>No reviews yet. Be the first one to give a review!</p>
                          </div>
                        )

                        }
                        
                    </article>
                </div>
            </section>
            <section className='mt-4 mb-4'>
                <h3 className='bold mb-4'>Write A Review</h3>
                <form id='novel-review-form' onSubmit={handleReviewFormSubmit}>
                    <div className='d-flex'>
                    {Auth.loggedIn() ? (
                        <div className='d-flex flex-wrap w-100'>
                            <div className='w-100'>
                                <p className='font-larger'>Rate the novel on a scale of 1-10</p>
                                <select id="novel-rating" defaultValue="select" onChange={handleReviewChange} className='rate-select mb-3' name='rating'>
                                    <option value="select" disabled hidden>Select</option>
                                    <option value="1"> 1 </option>
                                    <option value="2"> 2 </option>
                                    <option value="3"> 3 </option>
                                    <option value="4"> 4 </option>
                                    <option value="5"> 5 </option>
                                    <option value="6"> 6 </option>
                                    <option value="7"> 7 </option>
                                    <option value="8"> 8 </option>
                                    <option value="9"> 9 </option>
                                    <option value="10"> 10 </option>
                                </select>
                            </div>
                            {reviewFormError.includes('rating') && (
                                <p className='err-text'>{reviewFormError}</p>
                            )}
                            <p className='font-larger w-100'>Write text for the review:</p>
                            <textarea onChange={handleReviewChange} name="reviewText" rows="8" className='review-textarea'></textarea>
                            <button type="submit" className='btn review-submit-btn'><FontAwesomeIcon icon={faPaperPlane} /></button>
                            {reviewFormError.includes('text') && (
                                <p className='mt-3 err-text'>{reviewFormError}</p>
                            )}
                            {error && error.message.includes('maximum') && error.message.includes('length') && (
                                <p className='mt-3 err-text'>Failed to submit. Review must be shorter than 10,000 characters</p>
                            )}
                        </div>
                    ) : (
                        <textarea name="" rows="8" className='review-textarea unactive-textarea' readOnly value="Must be logged in to write a review!"></textarea>
                    )}
                        
                        
                    </div>
                </form>
            </section>
            
        </div>
    );
}

export default SingleNovel;