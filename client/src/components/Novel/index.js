import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReadme } from "@fortawesome/free-brands-svg-icons"
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { TOGGLE_ADD_TO_FAVORITES } from '../../utils/mutations';

function Novel({ novel }) {

    const { loading, data } = useQuery(GET_ME);
    const me = data?.me || {}

    const [toggleFavorite, { error }] = useMutation(TOGGLE_ADD_TO_FAVORITES);

    const [favorite, setFavorite] = useState(false);

    const handleToggleFavorite = async (event) => {
        setFavorite(!favorite);

        try {
            const userObj = await toggleFavorite({
                variables: { novelId: novel._id}
            });

            console.log(userObj.data.addFavNovel.favoriteNovels);
        } 
        catch (e) {
            console.error(e);
            return;
        }
    }

    
    useEffect(() => {
        // make sure me has data.
        if(me.username){
            // when me changes and has data. check to see if this novel is within
            // one of this users favoritNovel objects
            if(me.favoriteNovels.some(novelSearch => novelSearch._id === novel._id)){
                setFavorite(true);
            }
        }
    }, [me]);

    return(
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
                <div onClick={handleToggleFavorite}>
                    <button className="btn fav-btn bold ml-3">
                    <FontAwesomeIcon icon={faHeart} className={favorite ? "novel-list-icon red-heart" : "novel-list-icon"}/>Add To Favorites
                    </button>
                </div>
                
            </div>
        </article>
    );
}

export default Novel;