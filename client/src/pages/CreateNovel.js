import { ADD_NOVEL } from "../utils/mutations";
import { useState } from 'react';
import { useMutation } from '@apollo/client';

import FilePondCustom from "../components/FilePondCustom";

function CreateNovel() {

    const [charCount, setCharCount] = useState(0);

    const [files, setFiles] = useState([]);

    const [novelFormState, setNovelFormState] = useState({ title: '', description: '', penName: '' });
    const [addNovel, { error }] = useMutation(ADD_NOVEL);
    const handleNovelChange = (event) => {
        // get name and value of input element from the event.target
        let { name, value } = event.target;

        if(name === 'description'){
            setCharCount(value.replace(/ +/g, ' ').trim().length)
        }
    
        setNovelFormState({
          ...novelFormState,
          // removes any extra spaces and replaces it with just one space, but keeps newlines.
          [name]: value.replace(/ +/g, ' ').trim(),
        });
    };
    const handleNovelSubmit = async (event) => {
        event.preventDefault();

        console.log(files)

        try {
        const { data } = await addNovel({
            // and pass in variable data from form
            variables: { ...novelFormState }
        });

        window.location.assign(`/novel/${data.addNovel._id}`)
        } 
        catch (e) {
            console.error(e);
            return;
        }
    };

    

    console.log(novelFormState);
    return(
        <div>
            <div className="mt-3 mb-3">
                <h2 className="m-0">Submit Novel For Review</h2>
            </div>
            <div className="row pt-3 mb-3 align-items-center">
                <div className="col-12 col-lg-1 text-center">
                    <h3>Info</h3>
                </div>
                <div className="col-12 col-lg-11 info-box">
                    <p className="bold">**DISREGARD THIS INFO BOX. THIS IS A DEVELOPMENT BUILD, YOU CAN JUST CREATE A NOVEL LIKE
                        NORMAL BY ENTERING THE NOVEL INFO AND CLICKING SUBMIT**
                    </p>
                    <p>We pride ourselves on being able to deliver high-quality stories to our readers. All novels submitted 
                        through this form undergo a review by
                        our team of avid readers. We love to provide feedback to aspiring authors that wish to improve their writing
                        ability. 
                    </p>
                    <p>
                        For the review, we ask for the first 3 chapters of your novel, the description and title. Your novel does
                        NOT have to be completed in order for you to submit the first 3 chapters to our site. We accept ongoing and 
                        completed novels.
                    </p>
                    <p className="m-0">
                        If your novel is approved by our team, you will receive an email notifying you. If your novel is not accepted
                        you will still receive an email with feedback on what you can do to improve your novel.
                    </p>
                </div>
            </div>
            <div className="pt-3 mb-5">
                <form action="" className="font-18" onSubmit={handleNovelSubmit}>
                    <div className='d-flex flex-wrap mb-3'>
                        <label htmlFor="title" className='bold w-100'>Title:</label>
                        <input
                            className='form-padding mt-2 w-50'
                            placeholder='Novel title'
                            name='title'
                            type='text'
                            id='title'
                            onChange={handleNovelChange}
                        />
                        {error && error.message.includes('title') && error.message.includes('required') && (
                            <div className="w-100">
                                <p className="m-0 bold text-danger font-reg">Novel must have title</p>
                            </div>
                            
                        )}
                    </div>
                    <div className='d-flex flex-wrap pt-3 mb-3'>
                        <label htmlFor="penName" className='bold w-100'>Pen Name:</label>
                        <p className="novel-desc m-0 font-reg">*(Optional) The name that will be put as the author for this novel.
                            If no pen name is specified, your account's username will be used.
                        </p>
                        <input
                            className='form-padding mt-2 w-50'
                            placeholder='Author'
                            name='penName'
                            type='text'
                            id='penName'
                            onChange={handleNovelChange}
                        />
                    </div>
                    <div className="pt-3 mb-3">
                        <p className="bold">Cover Image:</p>
                        <FilePondCustom files={files} setFiles={setFiles}></FilePondCustom>
                    </div>
                    <div className='d-flex flex-wrap pt-3 w-75'>
                        <label htmlFor="description" className='bold w-100'>Description:</label>
                        <p className={charCount > 999 ? "novel-desc m-0 font-reg text-danger bold" : "novel-desc m-0 font-reg"}>
                            Max Character Count: {charCount}/1000
                        </p>
                        <textarea
                            className='form-padding mt-2 w-100'
                            rows="7"
                            placeholder='About your novel...'
                            name='description'
                            type='text'
                            id='description'
                            onChange={handleNovelChange}
                        />
                        {error && error.message.includes('description') && error.message.includes('required') && (
                            <div className="w-100">
                                <p className="m-0 bold text-danger font-reg">Novel must have description</p>
                            </div>
                            
                        )}
                        {error && error.message.includes('description') && error.message.includes('maximum') && (
                            <div className="w-100">
                                <p className="m-0 bold text-danger font-reg">Description must be 1000 letters or less</p>
                            </div>
                            
                        )}
                        <div className='mt-4 w-100'>
                            <button className='btn login-submit' type='submit'>
                                Submit
                            </button>
                        </div>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}

export default CreateNovel;