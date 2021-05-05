import axios from "axios";

import { store } from '../store'

const server = axios.create({
    baseURL: `//${window.location.hostname}/panr/`
});

export default server;