import axios from "axios";
import config from "../../config";

export default function (to,from) {
  return axios.get(config.server + `/get/messages/${to}/${from}`).then((response) => {
    return response.data;
  }).catch((err)=>{return err});
}
