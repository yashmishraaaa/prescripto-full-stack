import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Function to format the date (e.g., "20_01_2000" => "20 Jan 2000")
  const slotDateFormat = (slotDate) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    if (!slotDate) return "Invalid date";

    const dateArray = slotDate.split("_");

    if (dateArray.length !== 3) return "Invalid date";

    return `${dateArray[0]} ${months[Number(dateArray[1]) - 1]} ${dateArray[2]}`;
  };

  // Function to calculate age (e.g., "2000-01-20" => 24)
  const calculateAge = (dob) => {
    if (!dob || isNaN(new Date(dob))) return "Invalid date";

    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) age--;

    return age;
  };

  // Context value to be provided
  const value = {
    backendUrl,
    currency,
    slotDateFormat,
    calculateAge,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
