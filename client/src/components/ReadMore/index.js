import { useState } from 'react';

const ReadMore = ({ text, length = 300 }) => {
    const [showLess, setShowLess] = useState(true);
  
    return (
      <div className='mb-3'>
        <p className='m-0'
          dangerouslySetInnerHTML={{
            __html: showLess ? `${text.slice(0, length)}...` : text,
          }}
        ></p>
        <span
          className='read-more d-inline'
          onClick={() => setShowLess(!showLess)}
        >
          {showLess ? "Read more" : "Less ^"}
          </span>
      </div>
    );
  };

  export default ReadMore;