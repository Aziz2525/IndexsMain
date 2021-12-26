import axios from "axios";
import config from "../../config";

export default function (token) {
  return axios.get(config.server + `/get/users/find/token/${token}`).then((response) => {
    return response.data;
  }).catch((err)=>{return err});
}
