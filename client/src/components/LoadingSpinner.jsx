const LoadingSpinner = () => (
  <div className="space-y-2">
    {[...Array(10)].map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 animate-pulse"
      />
    ))}
  </div>
);

export default LoadingSpinner;
