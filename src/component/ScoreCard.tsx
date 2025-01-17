// Card.tsx
import React from 'react';

type scoreCardProps =  {
  title: string;
  content: number;
  cardColor: string;
}

const ScoreCard: React.FC<scoreCardProps> = ({ title, content, cardColor }) => {
  return (
    <div className="card bg-primary shadow-lg text-primary-content h-full m-4 mx-2" 
      style={{background: '#fff',
      borderBottom: `3px solid ${cardColor}`,
      borderRight: `3px solid ${cardColor}`,
      borderTop: `8px solid ${cardColor}`,
      borderLeft: `8px solid ${cardColor}`,
      maxHeight: "160px"
      }}>
      <div className="card-body text-black">
        <h2 className="card-title font-semibold text-xl">{title}</h2>
        <p className="text-2xl font-bold">{content}</p>
      </div>  
    </div>
  );
};

export default ScoreCard;
