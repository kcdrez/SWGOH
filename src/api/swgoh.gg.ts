import axios from "axios";

export default class apiClient2 {
  baseUrl = "https://6814-184-96-186-220.ngrok.io";

  constructor() {
  }

  async player(allycode: string) {
    return (await axios.get(this.baseUrl + "/player/" + allycode)).data
  }

  async gear() {
    return (await axios.get(this.baseUrl + "/gear")).data
  }
}
