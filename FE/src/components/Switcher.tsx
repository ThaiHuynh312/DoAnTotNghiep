import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { apiSearchable } from "@/services/user";

const Switcher = () => {
  const { user } = useUser();
  const [isChecked, setIsChecked] = useState<boolean>(user?.searchable ?? true);

  const handleCheckboxChange = async () => {
    try {
      const response = await apiSearchable();
      setIsChecked(!isChecked);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <>
      <label className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div
            className={`box block h-6 w-10 rounded-full ${
              isChecked ? "bg-[--color2]" : "bg-[--color4]"
            }`}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
              isChecked ? "translate-x-full" : ""
            }`}
          ></div>
        </div>
      </label>
    </>
  );
};

export default Switcher;
