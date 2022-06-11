import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NOVELS } from '../utils/queries';

import NovelList from '../components/NovelList'
import TopNovelImg from '../images/topnovels.png'

function Home() {

    useEffect(() => {
        // on load if speech synthesis is still talking, 
        // from another page, cancel the utterance.
        window.speechSynthesis.cancel();
      }, []);

    // must define novel as a state to use useEffect correctly
    const [novels, setNovels] = useState([]);

    const { loading, data } = useQuery(GET_NOVELS);

    // use effect ensures that all novel data is completely loaded
    // before rendering the SingleNovel page
    useEffect(() => {
        // check every novel to make sure all data has returned before
        // seeting novels state to the data.
        if (data?.novels.every((novel) => novel.user.username)) {
            console.log(novels)
            setNovels(data.novels); 
        }
    }, [data, loading, novels]);

    return (
        <div className="pb-5">
            { novels.length ? (
                <div>
                    <div className='text-center w-100'>
                    <img className='w-100 top-novel' src={TopNovelImg} alt="todays top novels banner" />
                    </div>
                    <div>
                        <NovelList novels={novels}></NovelList>
                    </div>
                </div>  
            ) : (<h4 className='text-center'>Loading...</h4>)
            }
            
        </div>
    );
}

export default Home;