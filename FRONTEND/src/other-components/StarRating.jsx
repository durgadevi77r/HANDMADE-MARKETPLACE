const StarRating = ({ rating = 0 }) => {
  const total = 5;
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const stars = [];
  for (let i = 0; i < total; i++) {
    if (i < full) stars.push('full');
    else if (i === full && hasHalf) stars.push('half');
    else stars.push('empty');
  }
  return (
    <div className="star-rating">
      {stars.map((t, idx) => (
        <span key={idx} style={{ color: t === 'empty' ? '#d1d5db' : '#f59e0b' }}>
          {t === 'half' ? '⭐' : '★'}
        </span>
      ))}
    </div>
  );
};

export default StarRating;