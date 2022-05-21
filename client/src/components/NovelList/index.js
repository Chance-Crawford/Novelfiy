

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
                <Novel novel={novel} key={novel._id}></Novel>
            ))}
        </section>
    );
}

export default NovelList;