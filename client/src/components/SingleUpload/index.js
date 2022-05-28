import React from 'react';
// import { createUploadLink } from "apollo-upload-client";
// import { ApolloClient, ApolloProvider, Mutation, InMemoryCache } from "apollo-client";
import { useMutation } from "@apollo/client";
import { SINGLE_UPLOAD } from '../../utils/mutations';

const SingleUpload = ({ files, setFiles }) => {

    const [singleUpload, { error: uploadError }] = useMutation(SINGLE_UPLOAD, {
        onCompleted: (data) => console.log(data),
    });
    
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        console.log(file)
        try {
            const { data: fileData } = await singleUpload({
                // and pass in variable data from form
                variables: { file }
    
            });
            console.log(fileData);
        } 
        catch (e) {
            console.log(uploadError?.message)
            console.error(e);
            return;
        }
      };
    return (
        <div className='mt-3'>
            <input name={'upload-file'} type={'file'} onChange={handleFileChange}/>
        </div>
    )
}

export default SingleUpload;