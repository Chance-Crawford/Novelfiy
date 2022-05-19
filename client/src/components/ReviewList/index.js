

function ReviewList({ reviews }) {

    // make copy of  review array so that they can  be reversed
    let copyReviews = [...reviews];
    copyReviews = copyReviews.reverse();

    return(
        <div className='novel-sub-list'>
            {copyReviews && copyReviews.map( review => (
                <div key={review._id}>
                    <div>
                        <p className="bold font-17">{review.user.username}</p>
                        <p className="ital font-17">{review.createdAt}</p>
                        <div className={review.rating < 4 ? 'mb-2 review-red' :
                            review.rating < 7 ? 'mb-2 review-yellow' :
                            'mb-2 review-green'
                            }>
                            <p className="m-0">Rating: {review.rating}/10</p>
                        </div>
                        
                        <p>{review.reviewText}</p>
                    </div>
                </div>
            ))}
        </div>  
    );
}

export default ReviewList;