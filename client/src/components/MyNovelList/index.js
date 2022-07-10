import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import AddToFavorites from '../AddToFavorites';
import { useState, useEffect } from 'react';

function MyNovelList({ novels }) {

    // media query
    const [matches, setMatches] = useState(
        window.matchMedia("(min-width: 992px)").matches
    )

    useEffect(() => {
        window
        .matchMedia("(min-width: 992px)")
        .addEventListener('change', e => setMatches( e.matches ));
    }, []);

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
                <div className='novel-box p-3' key={novel._id}>
                    {/* every novel */}
                    <article  >
                        <div className="d-flex flex-wrap justify-content-between">
                            <div className="d-flex w-100 align-items-center">
                                <div className='novel-div-margin-r'>
                                    <div className='cover-div'>
                                        <img src={novel.imageLink} className="w-100 nov-img" alt="book cover" />
                                    </div>
                                </div>
                                <div className='nov-info-box'>
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
                                        `${novel.description}`.length <= 440 && matches ? (
                                            <p className="novel-desc media-novel-desc">
                                                {novel.description}
                                            </p>
                                        )
                                        : `${novel.description}`.length <= 115 && !matches ? (
                                            <p className="novel-desc media-novel-desc">
                                                {novel.description}
                                            </p>
                                        ) : `${novel.description}`.length > 115 && !matches ? (
                                            <p className="novel-desc media-novel-desc">
                                                {
                                                    `${novel.description}`.substring(0, 105)
                                                }
                                                ...
                                                <a href={`/novel/${novel._id}`}>
                                                    <span className="read-more">Read more</span>
                                                </a>
                                            </p>
                                        ) : (
                                            <p className="novel-desc media-novel-desc">
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
                                    <div className="d-flex align-items-center btn-contain-novel">
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
                                        <div className='ml-fav'>
                                            <AddToFavorites novel={novel}></AddToFavorites>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                            <div className='edit-novel-btn-contain'>
                                <a href={`/edit-novel/${novel._id}`} className='btn edit-novel-btn bold ml-auto'>Edit Novel & Chapters</a>
                            </div>
                        </div>
                    </article>
                </div>
            ))}
        </section>
    );
}

export default MyNovelList;