import ReadMore from "../ReadMore";
import randomId from "../../utils/randomId";

function ReviewList({ reviews }) {

    // make copy of  review array so that they can  be reversed
    let copyReviews = [...reviews];
    copyReviews = copyReviews.reverse();

    return(
        <div className='novel-sub-list'>
            {copyReviews && copyReviews.map( review => (
                <div key={review._id} className='d-flex'>
                    <div className='avatar-small mr-2 pt-1'>
                        <a href={`/user/${review.user.username}`}>
                            <img className='w-100 user-avatar' src={review.user.image} alt="user profile picture" />
                        </a>
                    </div>
                    <div className="w-100">
                        <div className="d-flex flex-wrap mb-2">
                            <a href={`/user/${review.user.username}`}>
                                <p className="bold font-17 m-0 user-hover">{review.user.username}</p>
                            </a>
                            <p className="ital font-17 m-0 ml-2 created-at-review">{review.createdAt}</p>
                        </div>
                        <div className={review.rating < 4 ? 'mb-2 review-red w-50' :
                            review.rating < 7 ? 'mb-2 review-yellow w-50' :
                            'mb-2 review-green w-50'
                            }>
                            <p className="m-0">Rating: {review.rating}/10</p>
                        </div>
                        
                        <div className="text-over">
                            {
                                // have to put in a template literal to get it to read length
                                // and treat as string
                                `${review.reviewText}`.length <= 430 ? (
                                    <div className="">
                                        {/* split review text by the newline characters and make
                                        each section a paragraph */}
                                        {review.reviewText.split('\n').map(part=>(
                                            <p key={randomId(10)}>{part}</p>
                                        ))}
                                    </div>
                                ) : (
                                    <ReadMore text={review.reviewText} length={430}></ReadMore>
                                )
                            }
                        </div>
                        
                    </div>
                </div>
            ))}
        </div>  
    );
}

export default ReviewList;