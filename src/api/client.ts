import axios from "axios";

export default class apiClient {
  baseUrl = "";
  token = null;

  constructor() {
    this.baseUrl = "https://api.swgoh.help";
  }

  private async fetch(url: string, payload: any) {
    return (
      await axios.post(
        url,
        Object.assign(payload, { language: "ENG_US", enums: true }),
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${this.token}`,
          },
        }
      )
    ).data;
  }

  async connect() {
    const { data } = await axios.post(
      this.baseUrl + "/auth/signin",
      "username=drezzinator&password=cipjmbJ:11swgoh&grant_type=password&client_id=123&client_secret=abc",
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    this.token = data.access_token;
  }

  async fetchPlayer(allyCode: string) {
    return await this.fetch(this.baseUrl + "/swgoh/players", {
      allycodes: [allyCode],
    });
  }

  async fetchUnit(id: string) {
    const response = await this.fetch(this.baseUrl + "/swgoh/data", {
      collection: "unitsList",
      match: {
        id,
      },
    });
    return response[0];
  }
  async fetchAllUnits() {
    return await this.fetch(this.baseUrl + "/swgoh/data", {
      collection: "unitsList",
    });
  }
  async fetchData(collection: string) {
    return await this.fetch(this.baseUrl + "/swgoh/data", {
      collection,
    });
  }
  async fetchGear() {
    return await this.fetch(this.baseUrl + "/swgoh/data", {
      collection: "equipmentList",
    });
  }
}
