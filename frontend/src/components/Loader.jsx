// Loader.jsx
const Loader = () => {
  return (
    <div className="flex items-center justify-center gap-2  absolute w-full ">
      <div className="relative w-12 h-12 md:w-16 md:h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-dashed border-blue-400 rounded-full animate-spin"></div>

        {/* Inner pulse */}
        <div className="absolute inset-4 border-4 border-blue-500 rounded-full animate-ping "></div>

        {/* Center glow dot */}
        <div className="absolute inset-[1.1rem] md:inset-[1.5rem] bg-blue-600 rounded-full animate-pulse"></div>
      </div>
      <div className=" text-xl text-gray-700 font-semibold">
        Shortening your link...
      </div>
    </div>
  );
};

export default Loader;
