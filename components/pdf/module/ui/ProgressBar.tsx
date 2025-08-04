export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="mt-4">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2 font-medium">Processing... {Math.round(progress)}%</p>
    </div>
  );
};