import axios from "axios";
import config from "../../config";

export default function (from) {
  return axios.get(config.server + `/get/messages/${from}`).then((response) => {
    return response.data;
  }).catch((err)=>{return err});
}
