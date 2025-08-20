// components/Topbar.jsx
import { FiBell } from "react-icons/fi";

const Topbar = () => {
  return (
    <div className="flex justify-between items-center">
      <input
        type="text"
        placeholder="Search"
        className="bg-[#1e293b] text-white px-4 py-2 rounded-lg w-1/3 focus:outline-none"
      />
      <div className="flex items-center gap-4">
        <FiBell className="text-xl" />
        <img
          src="https://i.pravatar.cc/40?img=65"
          alt="User"
          className="w-10 h-10 rounded-full"
        />
        <span>stacklogix</span>
      </div>
    </div>
  );
};

export default Topbar;
