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

    const { loading: fLoading, data: fData } = useQuery(GET_ME);
    const me = fData?.me || {}

    const [toggleFavorite, { error: fError }] = useMutation(TOGGLE_ADD_TO_FAVORITES);

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
        // make sure me has fData.
        if(me.username){
            // when me changes and has fData. check to see if this novel is within
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
        </div>
    );
}

export default AddToFavorites;