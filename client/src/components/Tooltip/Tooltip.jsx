import React from "react";

const Tooltip = ({ children, text, position = "right" }) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowPosition = {
    top: "top-full left-1/2 -translate-x-1/2",
    bottom: "bottom-full left-1/2 -translate-x-1/2",
    left: "left-full top-1/2 -translate-y-1/2",
    right: "right-full top-1/2 -translate-y-1/2",
  };

  const arrowDirection = {
    top: "border-t-[6px] border-t-gray-800 border-x-[6px] border-x-transparent",
    bottom: "border-b-[6px] border-b-gray-800 border-x-[6px] border-x-transparent",
    left: "border-l-[6px] border-l-gray-800 border-y-[6px] border-y-transparent",
    right: "border-r-[6px] border-r-gray-800 border-y-[6px] border-y-transparent",
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute ${positionClasses[position]} z-50 rounded
          bg-[#252526] text-[#cccccc] text-[12px] font-mono px-[6px] py-[4px]
          border border-[#454545] shadow-lg 
          opacity-0 group-hover:opacity-100 transition-opacity duration-150
          pointer-events-none whitespace-nowrap`}
      >
        {text}
        {/* Arrow */}
        <div
          className={`absolute ${arrowPosition[position]} 
            w-0 h-0 ${arrowDirection[position]}`}
        />
      </div>
    </div>
  );
};

export default Tooltip;
