import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SINGLE_UPLOAD } from '../../utils/mutations';


// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
// shows image preview when image is uploaded
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// plugin that resizes the image to a smaller size.
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
// encodes the file as a json string so that we can store it in a database instead of
// storing an image on the server.
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageResize);

function FilePondCustom({ file, setFile }) {
    const [singleUpload, { error: uploadError }] = useMutation(SINGLE_UPLOAD);
    
    const handleFileChange = async (file) => {
        if (!file) return;
        console.log(file)
        setFile(file);
      };

    return (
        <div className="w-100">
            <FilePond
                //files={file}
                stylePanelAspectRatio={250/200}
                imageResizeTargetWidth={200}
                imageResizeTargetHeight={250}
                // when file is chosen, add it to the state
                onaddfile={(error, fileData)=>{handleFileChange(fileData.file)}}
                // when file is deleted, clear the state
                onremovefile={(error, file)=>{setFile({})}}
                allowMultiple={false}
                maxFiles={1}
                server={singleUpload}
                name="file"
                labelIdle='Drag & Drop your files or <span class="filepond--label-action browse-label-cust">Browse</span>'
            />
        </div>
    );
}

export default FilePondCustom;