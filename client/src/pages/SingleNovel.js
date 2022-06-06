// use id from url
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import ReviewList from '../components/ReviewList';
import AddToFavorites from '../components/AddToFavorites';
import PageNotFound from './PageNotFound';

import { useQuery } from '@apollo/client';
import { GET_NOVEL, GET_ME_SMALL, GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { ADD_REVIEW } from '../utils/mutations';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { faHeart, faPaperPlane, faCirclePlus } from '@fortawesome/free-solid-svg-icons'

function SingleNovel() {

    const { id: novelId } = useParams();

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


    

    return (
        <div>
            { novel.user ? (
            <div className="pb-5">
            <section className='d-flex justify-content-center flex-wrap light-shadow-bottom'>
                <div className='w-58 p-3 d-flex flex-wrap justify-content-between align-items-center'>
                    <div>
                        <div className='cover-div'>
                            <img src={novel.imageLink} className="w-100" alt="book cover" />
                        </div>
                    </div>
                    <div>
                        <div className='mt-3 mb-2 w-100'>
                            <h2 className='m-0 bold'>{novel.title}</h2>
                        </div>
                        <div className="mt-3 mb-2 w-100">
                            <p className="m-0">By. <a className="bold user-hover" href={`/user/${novel.user.username}`}>{novel.penName ? novel.penName : novel.user.username}</a></p>
                        </div>
                        <div className="mt-3 mb-2 w-100">
                            <FontAwesomeIcon icon={faHeart} /> <span>{novel.favoritesCount}</span>
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
                            <AddToFavorites novel={novel}></AddToFavorites>
                        </div>
                    </div>
                    
                </div>
            </section>
            <section className='mt-4 pb-3 light-bottom-border'>
                <div className='mb-3'>
                    <h4>@<a className="user-hover" href={`/user/${novel.user.username}`}>{novel.user.username}</a></h4>
                </div>
                <div className='mt-4 mb-3'>
                    <h3 className='bold'>Description</h3>
                </div>
                <div>
                <div className="novel-desc">
                    {novel.description.split('\n').map(part=>(
                            <p>{part}</p>
                        ))
                    }
                </div>
                </div>
            </section>
            <section className='mt-3 p-3'>
                <div className='row justify-content-between'>
                    <article className='novel-article col-12'>
                        <div className='d-flex justify-content-between'>
                            <h3>Chapters</h3>
                            {myNovel && (
                                <a href={`/create-chapter/${novel._id}`}>
                                    <FontAwesomeIcon className='add-chapter-btn' icon={faCirclePlus} />
                                </a>
                            )}
                            
                        </div>
                        
                        <hr />
                        <div>
                            {myNovel && novel.chapterCount < 1 ? (
                                <p className='mt-3 font-18'>Click the '+' button to add your first chapter!</p>
                            ) : myNovel && novel.chapterCount > 0 ? (
                                <p className='mt-3 font-18'>Click the '+' button to add your next chapter!</p>
                            ) : novel.chapterCount > 0 ? (
                                <div></div>
                            ) : (
                                <p className='mt-3 font-18'>No chapters have been released yet.</p>
                            )}
                            
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
        ) : !loading && !novel.title ? (
            <PageNotFound></PageNotFound>
        ) : (<h4 className='text-center'>Loading...</h4>)
        }
        </div>
    );
}

export default SingleNovel;