import { tinyApiUrl } from "@/constants/tiny";

import { RestClient } from "./restClient";

export const AppRestClient = new RestClient({ config: { baseURL: tinyApiUrl } });
