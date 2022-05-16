import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { faHeart } from '@fortawesome/free-solid-svg-icons'

function NovelList({ novels }) {

    if(!novels.length){
        return(
            <div className="text-center">
                <p>Loading Books...</p>
            </div>
            
        );
    }

    return (
        <section className="w-100">
            {novels && novels.map( novel => (
                <article key={novel._id} className="mt-4 mb-4">
                    <div className="mt-3 mb-3">
                        <Link to={`/novel/${novel._id}`}>
                            <h3 className="bold">{novel.title}</h3>
                        </Link>
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
                                    <Link to={`/novel/${novel._id}`}>
                                        <span className="read-more">Read more</span>
                                    </Link>
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
                        <div>
                            <button className="btn fav-btn bold ml-3">
                            <FontAwesomeIcon icon={faHeart} className="novel-list-icon"/>Add To Favorites
                            </button>
                        </div>
                        
                    </div>
                </article>
            ))}
        </section>
    );
}

export default NovelList;