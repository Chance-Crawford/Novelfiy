

import Novel from '../Novel';

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
                <div className='novel-box p-3'>
                    <Novel novel={novel} key={novel._id}></Novel>
                </div>
            ))}
        </section>
    );
}

export default NovelList;