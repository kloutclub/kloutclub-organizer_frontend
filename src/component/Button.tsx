import React from 'react';

type buttonProps = {
    buttonTitle: string
}

const Button: React.FC<buttonProps> = ({ buttonTitle }) => {
    return (
        <button className="btn bg-klt_primary-900 hover:bg-klt_primary-200 outline-none border-none text-white h-10 min-h-10">{ buttonTitle }</button>
    )
}

export default Button

