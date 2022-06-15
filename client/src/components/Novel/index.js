import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';



import AddToFavorites from '../AddToFavorites';


function Novel({ novel }) {

    console.log(novel)
    return(
        <article  >
            <div className="d-flex align-items-center">
                <div className='novel-div-margin-r'>
                    <div className='cover-div'>
                        <img src={novel.imageLink} className="w-100" alt="book cover" />
                    </div>
                </div>
                <div className=''>
                    <div className="mb-3">
                        {/* since data wasnt loading very well on single novel with link,
                        use <a> so that the page will refresh*/}
                        <a href={`/novel/${novel._id}`}>
                            <h3 className="bold">{novel.title}</h3>
                        </a>
                    </div>
                    <div className="mb-3">
                        <a href={`/user/${novel.user.username}`}>
                            <p className="m-0 user-hover">By. <span className="ital">{novel.penName ? novel.penName : novel.user.username}</span></p>
                        </a>
                    </div>
                    <div className="mb-3">
                        <FontAwesomeIcon icon={faHeart} /> <span>{novel.favoritesCount}</span>
                    </div>
                    <div className="mb-3">
                        {
                            // have to put in a template literal to get it to read length
                            // and treat as string
                            `${novel.description}`.length <= 440 ? (
                                <p className="novel-desc">
                                    {novel.description}
                                </p>
                            )
                            : (
                                <p className="novel-desc">
                                    {
                                        // if description more than 450 characters, add read more
                                        `${novel.description}`.substring(0, 440)
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
                            {novel?.chapters?.length ? (
                                <a href={`/chapter/${novel.chapters[0]._id}`} className="btn read-btn bold">
                                    <FontAwesomeIcon icon={faReadme} className="novel-list-icon"/>Read
                                </a>
                            ) : (
                                <a href={`/novel/${novel._id}`} className="btn read-btn bold">
                                    <FontAwesomeIcon icon={faReadme} className="novel-list-icon"/>Read
                                </a>
                            )}
                            
                        </div>
                        <AddToFavorites novel={novel}></AddToFavorites>
                        
                    </div>
                </div>
            </div>
        </article>
    );
}

export default Novel;