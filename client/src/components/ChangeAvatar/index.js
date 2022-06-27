import { useMutation } from '@apollo/client';
import { SINGLE_UPLOAD, UPDATE_AVATAR } from "../../utils/mutations";
import { useState, useEffect } from 'react';

import FilePondCustom from "../FilePondCustom";
import Arrow from "../../images/arrow.png"

function ChangeAvatar({ user }) {

    const [file, setFile] = useState({});

    const [userState, setUserState] = useState(user);
    console.log(userState);

    const [singleUpload, { error: uploadError }] = useMutation(SINGLE_UPLOAD, {
        onCompleted: (data) => console.log(data),
    });

    const [updateAvatar, { error: avatarError }] = useMutation(UPDATE_AVATAR, {
        onCompleted: (data) => console.log(data),
    });

    useEffect(() => {
        if(file.type){
            setUserState({
                ...userState,
                image: ''
            });
        } else {
            setUserState({
                ...userState,
                image: user.image
            });
        }
    }, [file, setFile]);

    console.log(userState);

    async function handleAvatarSubmit(event){
        event.preventDefault();

        if(userState.username &&  !userState.image.length && file.type){
            // upload image to server
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

            // update the users avatar
            try {
                const { data } = await updateAvatar({
                    // and pass in variable data from form
                    variables: { userId: userState._id, image: userState.image }
                });
    
                console.log(data);
                //window.location.assign(`/novel/${data.updateAvatar.username}`);
            } 
            catch (e) {
                
                console.error(e);
                return;
            }
        }
        
    }


    return ( 
        <div className='main-contain w-100'>
            <section className='w-100 table-center-section'>
                <div className='mb-4'>
                    <h2 className='bold text-center'>Change Profile Picture</h2>
                    <p className='novel-desc font-18 text-center'>Recommended Profile Picture Size: 300px &times; 300px</p>
                </div>
                <div className='w-100 d-flex flex-wrap justify-content-center align-items-center'>
                    <img className='w-25' src={user.image} alt="current profile picture" />
                    <div className='m-3'>
                        <img src={Arrow} alt="arrow pointing to the right" />
                    </div>
                    <div className='w-25 pt-3'>
                        <FilePondCustom height={200} width={200} file={file} setFile={setFile}></FilePondCustom>
                    </div>
                </div>
                <div className='d-flex justify-content-center mt-4'>
                    <button onClick={handleAvatarSubmit} className='btn login-submit m-0'>Save</button>
                </div>
            </section>
        </div>
     );
}

export default ChangeAvatar;