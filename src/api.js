import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.1.90:5000",
});
