import axios from "axios";
import config from "../../config";

export default function (username) {
  return axios.get(config.server + `/get/users/find/${username}`).then((response) => {
    return response.data;
  }).catch((err)=>{return err});
}
