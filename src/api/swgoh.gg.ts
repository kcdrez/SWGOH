import axios from "axios";

export default class apiClient2 {
  baseUrl = "http://5716-24-28-77-202.ngrok.io";
  // baseUrl = "https://6814-184-96-186-220.ngrok.io";

  constructor() {}

  async player(allycode: string) {
    const response = await axios.get(this.baseUrl + "/player/" + allycode);
    return response.data;
  }

  async gear() {
    const response = await axios.get(this.baseUrl + "/gear");
    return response.data;
  }
}
