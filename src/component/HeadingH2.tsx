import React from 'react';

type headingProps = {
    title: string | undefined;
}

const HeadingH2: React.FC<headingProps> = ({ title }) => {
    return <h2 className="text-3xl font-semibold text-black">{title}</h2>
}

export default HeadingH2