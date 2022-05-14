import { useQuery } from '@apollo/client';
import { GET_NOVELS } from '../utils/queries';

import NovelList from '../components/NovelList'

function Home() {
    
    const { loading, data } = useQuery(GET_NOVELS);
    // wait for data to get novels array
    const novels = data?.novels || [];
    console.log(novels);

    return (
        <div className="">
            <div className='p-3 text-center'>
                <h2 className='m-0 bold'>Top Novels For Today</h2>
            </div>
            <div>
                <NovelList novels={novels}></NovelList>
            </div>
        </div>
    );
}

export default Home;