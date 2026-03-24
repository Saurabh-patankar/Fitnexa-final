const TrendingTags = ({ posts }) => {
    const tagCount = {};
  
    posts.forEach((post) => {
      post.hashtags?.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
  
    const sorted = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
  
    return (
      <div className="bg-gray-900 p-4 rounded-lg border border-pink-500/20">
        <h3 className="text-pink-400 font-semibold mb-2">🔥 Trending Tags</h3>
        {sorted.length === 0 ? (
          <p className="text-gray-400 text-sm">No tags yet</p>
        ) : (
          <ul className="text-sm text-pink-300 space-y-1">
            {sorted.slice(0, 10).map(([tag, count]) => (
              <li key={tag}>
                #{tag} <span className="text-gray-400">({count})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default TrendingTags;