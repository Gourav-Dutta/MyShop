export const ProductPageLoader = () => {
     return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-6">
      
      <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      
      
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}