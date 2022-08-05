import QRCode from "qrcode.react";

const useLogin = () => {
  let access_token = localStorage.getItem("access_token");
  let refresh_token = localStorage.getItem("refresh_token");

  const access_code =
    localStorage.getItem("access_code") ||
    randomstring.generate({ length: 6, capitalization: "uppercase" });
  localStorage.setItem("access_code", access_code);
};

export default useLogin;
