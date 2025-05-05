
import React from 'react';

const smileys = [
  { color: '#FEF1A7', mood: 'happy' },
  { color: '#FEF7E3', mood: 'smile' },
  { color: '#FDBE9F', mood: 'excited' },
  { color: '#F8D3BA', mood: 'playful' },
  { color: '#E5DEFF', mood: 'relaxed' },
  { color: '#9CCFD8', mood: 'calm' },
  { color: '#C3E6D7', mood: 'peaceful' },
  { color: '#FFC0B6', mood: 'energetic' },
  { color: '#FEB89F', mood: 'curious' },
];

const SmileyRow: React.FC = () => {
  return (
    <div className="flex justify-center space-x-1 py-3">
      {smileys.map((smiley, index) => (
        <div 
          key={index}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: smiley.color }}
        >
          <span className="text-lg" role="img" aria-label={smiley.mood}>
            🙂
          </span>
        </div>
      ))}
    </div>
  );
};

export default SmileyRow;
