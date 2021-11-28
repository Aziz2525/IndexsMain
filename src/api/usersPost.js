import axios from "axios";
import config from "../../config";

export default function (username, phoneNumber, fid) {
  const article = { username, phoneNumber, fid };
  return axios.post(config.server + "/post/users", article).then((response) => {
    return response.data;
  }).catch((err)=>{return err});
}
