import axios from "axios";
import { Platform } from "react-native";
import config from "../../config";

export default function (imageDetail, username, from) {
  const data = new FormData();
  data.append("ProfilePhoto", {
    uri:
      Platform.OS === "android"
        ? imageDetail.uri
        : imageDetail.uri.replace("file://", ""),
    type: imageDetail.type,
    name: from + "profile_image" +  Date.now(),
  });
  data.append("username", username );
  const configaxios = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  return axios
    .post(config.server + `/post/users/updateprofile?from=${from}`, data, configaxios)
    .then((response) => {
        console.log(response.data)
      return response.data;
    })
    .catch((err) => {
        console.log(err)
      return err;
    });
}
