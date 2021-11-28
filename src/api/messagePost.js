import axios from "axios";
import config from "../../config";

export default function (to,from,message) {
  const article = { to, from, message };
  return axios.post(config.server + `/post/messages/${to}/${from}/${message}`, article).then((response) => {
    return response.data;
  }).catch((err)=>{return err});
}
