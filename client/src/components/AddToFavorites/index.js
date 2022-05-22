import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { GET_ME } from '../../utils/queries';
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { TOGGLE_ADD_TO_FAVORITES } from '../../utils/mutations';

// generates add to favorites button with all its functionality 
function AddToFavorites({ novel }) {

    const { loading, data } = useQuery(GET_ME);

    const [me, setMe] = useState({});

    useEffect(() => {
        // make sure me has complete data by being as specific as possible.
        if(data?.me.givenReviews){
            // if data has returned fully give me a value
            setMe(data.me)
        }
    }, [data, loading]);

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

    // once me was declared a value in the useEffect above. this will activate
    useEffect(() => {
        // make sure me has data.
        if(me.username){
            console.log(me)
            // when me changes and has data. check to see if this novel is within
            // one of this users favoritNovel objects
            if(me.favoriteNovels.some(novelSearch => novelSearch._id === novel._id)){
                setFavorite(true);
            }
        }
    }, [me]);

    return(
        <div onClick={handleToggleFavorite}>
            <button className="btn fav-btn bold ml-3">
            <FontAwesomeIcon icon={faHeart} className={favorite ? "novel-list-icon red-heart" : "novel-list-icon"}/>Add To Favorites
            </button>
            {error?.message.includes("logged in") && alert("Must be logged in to save this novel to favorites!")}
        </div>
        
    );
}

export default AddToFavorites;