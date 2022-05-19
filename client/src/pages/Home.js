import { useQuery } from '@apollo/client';
import { GET_NOVELS } from '../utils/queries';

import NovelList from '../components/NovelList'
import TopNovelImg from '../images/topnovels.png'

function Home() {
    
    const { loading, data } = useQuery(GET_NOVELS);
    // wait for data to get novels array
    const novels = data?.novels || [];
    console.log(novels);

    return (
        <div className="pb-5">
            <div className='text-center w-100'>
                <img className='w-100 top-novel' src={TopNovelImg} alt="todays top novels banner" />
            </div>
            <div>
                <NovelList novels={novels}></NovelList>
            </div>
        </div>
    );
}

export default Home;