import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { Link } from 'react-router-dom';

import AddToFavorites from '../AddToFavorites';


function Novel({ novel }) {

    return(
        <article className="mt-4 mb-4">
            <div className="mt-3 mb-3">
                {/* since data wasnt loading very well on single novel with link,
                use <a> so that the page will refresh*/}
                <a href={`/novel/${novel._id}`}>
                    <h3 className="bold">{novel.title}</h3>
                </a>
            </div>
            <div className="mb-3">
                <p className="m-0">By. <span className="ital">{novel.penName ? novel.penName : novel.user.username}</span></p>
            </div>
            <div className="mb-3">
                {
                    // have to put in a template literal to get it to read length
                    // and treat as string
                    `${novel.description}`.length <= 450 ? (
                        <p className="novel-desc">
                            {novel.description}
                        </p>
                    )
                    : (
                        <p className="novel-desc">
                            {
                                // if description more than 450 characters, add read more
                                `${novel.description}`.substring(0, 447)
                            }
                            ...
                            <a href={`/novel/${novel._id}`}>
                                <span className="read-more">Read more</span>
                            </a>
                        </p>
                    )
                }
            </div>
            <div className="d-flex align-items-center">
                <div>
                    <button className="btn read-btn bold">
                        <FontAwesomeIcon icon={faReadme} className="novel-list-icon"/>Read
                    </button>
                </div>
                <AddToFavorites novel={novel}></AddToFavorites>
                
            </div>
        </article>
    );
}

export default Novel;