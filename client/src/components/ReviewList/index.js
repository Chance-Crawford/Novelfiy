import ReadMore from "../ReadMore";

function ReviewList({ reviews }) {

    // make copy of  review array so that they can  be reversed
    let copyReviews = [...reviews];
    copyReviews = copyReviews.reverse();

    return(
        <div className='novel-sub-list'>
            {copyReviews && copyReviews.map( review => (
                <div key={review._id}>
                    <div>
                        <div className="d-flex mb-2">
                            <p className="bold font-17 m-0">{review.user.username}</p>
                            <p className="ital font-17 m-0 ml-2">{review.createdAt}</p>
                        </div>
                        <div className={review.rating < 4 ? 'mb-2 review-red' :
                            review.rating < 7 ? 'mb-2 review-yellow' :
                            'mb-2 review-green'
                            }>
                            <p className="m-0">Rating: {review.rating}/10</p>
                        </div>
                        
                        {
                            // have to put in a template literal to get it to read length
                            // and treat as string
                            `${review.reviewText}`.length <= 430 ? (
                                <p className="">
                                    {review.reviewText}
                                </p>
                            ) : (
                                <ReadMore text={review.reviewText} length={430}></ReadMore>
                            )
                        }
                    </div>
                </div>
            ))}
        </div>  
    );
}

export default ReviewList;