import errImg from '../images/404-error-img.png'

function PageNotFound() {

    return(
        <div className='main-contain w-100'>
            <section className='w-100 table-center-section'>
            <div className='w-100 d-flex justify-content-center align-items-center'>
                <img className='w-50' src={errImg} alt="no page found cat illustration" />
            </div>
        </section>
        </div>
    );
}

export default PageNotFound;