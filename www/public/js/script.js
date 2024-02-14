$(document).ready(function () {
  axios.defaults.baseURL = "https://api.myweb.test:8443";
  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;

  const data = {
    email: "admin@myweb.test",
    password: "password",
  };

  const loginRoute = "my-login";
  const userRoute = "api/user";

  //test(data, loginRoute, userRoute); // execute the postman test function
  authenticateUser(); // execute the test face auth function

  // Face authentication
  function authenticateUser() {
    const faceio = new faceIO("<Public-ID>");
    faceio
      .authenticate({
        locale: "auto",
      })
      .then((userData) => {
        console.log("Success, user recognized");
        console.log("Linked facial Id: " + userData.facialId);
        console.log("Associated Payload: " + JSON.stringify(userData.payload));

        const data = {
          email: userData.payload.email,
        };

        const loginRoute = "my-face-login";
        const userRoute = "api/user";

        test(data, loginRoute, userRoute);
      })
      .catch((errCode) => {
        console.log(errCode);
        faceio.restartSession();
      });
  }

  // test function from Postman
  function test(data, loginRoute, userRoute) {
    axios
      .get("sanctum/csrf-cookie")

      .then((response) => {
        console.log(Cookies.get("XSRF-TOKEN"));

        return axios.post(loginRoute, data);
      })

      .then((response) => {
        console.log(response);
        Cookies.set("access_token", response.data.token);

        return axios.get(userRoute, {
          headers: {
            Authorization: `Bearer ` + Cookies.get("access_token"),
          },
        });
      })

      .then((response) => {
        console.log(response);
      })

      .catch((error) => console.log(error.response));
  }
});