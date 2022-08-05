const useRegisterDevice = (data, callback, errorCallback, button) => {
  if (typeof errorCallback === undefined) {
    let errorCallback = function (a, s, d) {
      // console.log(a, s, d);
    };
  }
};

export default useRegisterDevice;
