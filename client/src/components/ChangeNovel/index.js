import { SINGLE_UPLOAD } from "../../utils/mutations";
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

function ChangeNovel({ novel }) {
    return ( 
        <div>
            <div className="font-18 d-flex flex-wrap mt-4">
                <label className="bold w-100" htmlFor="title">Title:</label>
                <input className="form-padding mt-2 w-50" type="text" id="title" />
            </div>
        </div>
     );
}

export default ChangeNovel;