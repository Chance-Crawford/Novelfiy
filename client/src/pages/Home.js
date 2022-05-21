import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NOVELS } from '../utils/queries';

import NovelList from '../components/NovelList'
import TopNovelImg from '../images/topnovels.png'

function Home() {

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
            { novels.length && (
                <div>
                    <div className='text-center w-100'>
                    <img className='w-100 top-novel' src={TopNovelImg} alt="todays top novels banner" />
                    </div>
                    <div>
                        <NovelList novels={novels}></NovelList>
                    </div>
                </div>  
            )
            }
            
        </div>
    );
}

export default Home;