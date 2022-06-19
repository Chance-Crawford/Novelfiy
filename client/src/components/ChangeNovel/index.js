import { SINGLE_UPLOAD } from "../../utils/mutations";
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

import FilePondCustom from "../FilePondCustom";

function ChangeNovel({ novel }) {

    const [charCount, setCharCount] = useState(novel.description.length);

    const [file, setFile] = useState({});

    const [novelFormState, setNovelFormState] = useState({ title: novel.title, description: novel.description, imageLink: novel.imageLink, penName: novel.penName });
    console.log(novelFormState);

    const [singleUpload, { error: uploadError }] = useMutation(SINGLE_UPLOAD, {
        onCompleted: (data) => console.log(data),
    });
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
        </div>
     );
}

export default ChangeNovel;