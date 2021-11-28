import {io} from 'socket.io-client'
import config from './config';
const SocketEndpoint = config.server;
const socket = io(SocketEndpoint, {
    transports: ['websocket']
  });
export default socket