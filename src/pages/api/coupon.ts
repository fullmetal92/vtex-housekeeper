// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import axiosThrottle from "axios-request-throttle";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

    axiosThrottle.use(axios, { requestsPerSecond: 5 });

    if (req.method === 'POST') {
        const url = req.body.url.trim();
        const appKey = req.body.appKey.trim();
        const appToken = req.body.appToken.trim();
        const payload = req.body.payload;

        // console.log(`Endpoint Url: ${url}`);
        // console.log(`AppKey: ${appKey}`)
        // console.log(`AppToken: ${appToken}`)
        // console.log(JSON.stringify(payload));

        const response = await axios.post(url, payload, {
            withCredentials: false,
            headers: {
                'X-VTEX-API-AppKey': appKey,
                'X-VTEX-API-AppToken': appToken
            }
        });

        try {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'max-age=180000');
            res.end(JSON.stringify(response.data));
        } catch(err) {
            res.json(err);
            res.status(405).end()
        }
    } else {
        res.status(405).json({message: 'The requested method type is not allowed'});
    }
}
