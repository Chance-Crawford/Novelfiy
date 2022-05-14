
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
                <article key={novel._id} className="mt-4 mb-4">
                    <div className="mt-3 mb-3">
                        <h3 className="bold">{novel.title}</h3>
                    </div>
                    <div className="mb-3">
                        <p className="m-0">By. <span className="ital">{novel.penName ? novel.penName : novel.user.username}</span></p>
                    </div>
                    <div>
                        <p className="novel-desc">
                            {novel.description}
                        </p>
                    </div>
                </article>
            ))}
        </section>
    );
}

export default NovelList;