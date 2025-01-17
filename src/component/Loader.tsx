import React from 'react';

const Loader:React.FC = () => {
  return (
    <div className='h-full w-full grid place-content-center'>
        <h6 className='text-lg font-semibold flex items-center gap-2'>Loading 
            <span className="loading loading-spinner text-klt_primary-500"></span>
        </h6>
    </div>
  )
}

export default Loader;