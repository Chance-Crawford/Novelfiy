import { SINGLE_UPLOAD, REMOVE_NOVEL, UPDATE_NOVEL } from "../../utils/mutations";
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import FilePondCustom from "../FilePondCustom";

function ChangeNovel({ novel }) {

    const [charCount, setCharCount] = useState(novel.description.length);

    const [file, setFile] = useState({});

    const [novelFormState, setNovelFormState] = useState({ novelId: novel._id, title: novel.title, description: novel.description, imageLink: novel.imageLink, penName: novel.penName });
    console.log(novelFormState);

    const [singleUpload, { error: uploadError }] = useMutation(SINGLE_UPLOAD, {
        onCompleted: (data) => console.log(data),
    });

    // remove novel
    const [removeNovel, { error: removeError }] = useMutation(REMOVE_NOVEL, {
        onCompleted: (data) => console.log(data),
    });

    const handleRemove = async (event) => {
        // get name and value of input element from the event.target
        let remove = window.confirm('Are you sure you want to delete this ENTIRE novel and all of it\'s chapters?');
        
        if(remove){
            try {
                await removeNovel({
                    variables: { novelId: novel._id }
                });

                window.location.assign(`/user/${novel.user.username}`)
            } 
            catch (e) {
                console.log(uploadError?.message)
                console.error(e);
                return;
            }
        }else{
            return;
        }
    };

    // update novel
    const [updateNovel, { error }] = useMutation(UPDATE_NOVEL, {
        onCompleted: (data) => console.log(data),
    });

    // If there is a new file trying to be uploaded by user, set iamgelink
    // of novel to none, since a new image will be uploaded. If the file
    // changes at any point, like the user deletes it. Change the image link back to the
    // original one.
    useEffect(() => {
        if(file.type){
            setNovelFormState({
                ...novelFormState,
                imageLink: ''
            });
        } else {
            setNovelFormState({
                ...novelFormState,
                imageLink: novel.imageLink
            });
        }
    }, [file, setFile]);

    async function handleUpdateSubmit(event){
        event.preventDefault();

        if(novelFormState.title.length && novelFormState.description.length && file.type){
            // if the form data is valid, then upload the image.
            try {
                await singleUpload({
                    variables: { file }
                });
            } 
            catch (e) {
                console.log(uploadError?.message)
                console.error(e);
                return;
            }
        }

        // if the form data is not valid, dont upload the image to the server
        // and just attempt to create the novel in order to retrieve the
        // errors.
        try {
            const { data } = await updateNovel({
                // and pass in variable data from form
                variables: { ...novelFormState }
            });

            window.location.assign(`/novel/${data.updateNovel._id}`);
        } 
        catch (e) {
            
            console.error(e);
            return;
        }
    }

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

    return ( 
        <div>
            <div>
                <div className="d-flex justify-content-end mt-4">
                    <div>
                        <button onClick={handleRemove} className="btn bold text-white del-btn"><FontAwesomeIcon icon={faTrashCan}/> &#160;Delete Novel</button>
                    </div>
                </div>
                <div className="mt-4">
                    <h2 className="bold">Change Book Cover:</h2>
                </div>
                <div className="font-18 d-flex flex-wrap w-75 justify-content-between upload-height pt-3 mb-4">
                    <div className="w-40">
                        <p className="bold">Current Cover Image:</p>
                        <p className="novel-desc pb-1 font-reg">If you want to keep the same book cover, <br />leave this section blank.</p>
                        <div>
                            <img className="w-100" src={novel.imageLink} alt="current book cover" />
                        </div>
                    </div>
                    <div className="w-40">
                        <p className="bold">New Cover Image:</p>
                        <p className="novel-desc pb-1 font-reg">Recommended Size: 200px &times; 250px <br></br>Max File Size: 5MB</p>
                        <FilePondCustom file={file} setFile={setFile}></FilePondCustom>
                    </div>
                </div>
            </div>
            <form onSubmit={handleUpdateSubmit}>
                <div className="font-18 d-flex flex-wrap mb-4">
                    <label className="bold w-100" htmlFor="title">Title:</label>
                    <input 
                        className="form-padding mt-2 w-50" 
                        defaultValue={novel.title}
                        name="title" 
                        type="text" 
                        id="title" 
                        onChange={handleNovelChange}
                    />
                </div>
                <div className='font-18 d-flex flex-wrap mb-4'>
                    <label htmlFor="penName" className='bold w-100'>Pen Name:</label>
                    <input
                        className='form-padding mt-2 w-50'
                        defaultValue={novel.penName}
                        name='penName'
                        type='text'
                        id='penName'
                        onChange={handleNovelChange}
                    />          
                </div>
                <div className='font-18 d-flex flex-wrap w-75 mb-5'>
                    <label htmlFor="description" className='bold w-100'>Description:</label>
                    <p className={charCount > 999 ? "novel-desc m-0 font-reg text-danger bold" : "novel-desc m-0 font-reg"}>
                        Max Character Count: {charCount}/1000
                    </p>
                    <textarea
                        className='form-padding mt-2 w-100'
                        rows="7"
                        defaultValue={novel.description}
                        name='description'
                        type='text'
                        id='description'
                        onChange={handleNovelChange}
                    />
                    <div className='mt-4 w-100'>
                        <button className='btn login-submit' type='submit'>
                            Submit
                        </button>
                    </div>
                </div>
            </form>
            
        </div>
     );
}

export default ChangeNovel;