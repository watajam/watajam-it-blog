//src/libs/client.ts

import { createClient } from "microcms-js-sdk"; //ES6

// Initialize Client SDK.
export const client = createClient({
  serviceDomain: "watajam-it-blog", // YOUR_DOMAIN is the XXXX part of XXXX.microcms.io
  apiKey: process.env.API_KEY, // YOUR_API_KEY is the YYYY part of XXXX.microcms.io
});
