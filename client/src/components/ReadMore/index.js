import { useState } from 'react';

const ReadMore = ({ text, length = 300 }) => {
    const [showLess, setShowLess] = useState(true);
  
    return (
      <div className='mb-3 big-c'>
        <div className='m-0'
        >
            {/* if show less is true, cut the text. if not,
            show the whole text and if ther are \n split the text into
            p tags at each \n */}
            {!showLess ? text.split('\n').map(part=>(
                <p>{part}</p>
            )) : 
            <p className='m-0'>{text.slice(0, length)}...
                <span
                    className='read-more d-inline'
                    onClick={() => setShowLess(!showLess)}
                >
                {showLess ? "Read more" : "Less ^"}
                </span>
            </p>
            }
        </div>
        {!showLess && (
            <span
            className='read-more d-inline'
            onClick={() => setShowLess(!showLess)}
          >
            {showLess ? "Read more" : "Less ^"}
            </span>
        )}
        
      </div>
    );
  };

  export default ReadMore;