import { createContext, useState, useEffect, useContext } from "react";
import { useTokensContext } from "./tokens-context";

const ApiContext = createContext();

ApiContext.displayName = "ApiContext";

export const ApiContextProvider = ({ children }) => {
  const [categories, setCategoriesList] = useState([]);
  const [credentials, setCredentials] = useState(null);
  const { tokens } = useTokensContext();

  const value = { credentials, categories, setCategoriesList };

  useEffect(async () => {
    if (tokens.user) {
      if (
        localStorage.getItem("credentials") &&
        JSON.parse(localStorage.getItem("credentials")).customer_id ===
          tokens.user.customer_id
      ) {
        if (!credentials) {
          setCredentials(JSON.parse(localStorage.getItem("credentials")));
        }
      } else {
        const res = await compressService.getCustomerCredentialByName({});
        localStorage.setItem("credentials", JSON.stringify(res));
        setCredentials(res);
      }

      if (localStorage.getItem("categories")) {
        if (categories.length === 0) {
          setCategoriesList(JSON.parse(localStorage.getItem("categories")));
        }
      } else {
        const categories = await compressService.getCategories();
        localStorage.setItem("categories", JSON.stringify(categories.data));
        setCategoriesList(categories);
      }
    }
  }, [tokens.user]);

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export function useApiContext() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used under <ApiContextProvider/>");
  }
  return context;
}
