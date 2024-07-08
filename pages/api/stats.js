import jwt from 'jsonwebtoken';
import {findVideoIdByUser, insertStats, updateStats} from "../../lib/db/hasura";
import {verifyToken} from "../../lib/utils";

export default async function stats (req, res){
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).send('You are not authenticated');
        }

        const inputParams = req.method === 'POST' ? req.body : req.query;
        const { videoId } = inputParams;

        if (!videoId) {
            return res.status(404).send({ done: false, error: 'VideoId not found' });
        }

        const userId = await verifyToken(token);

        const findVideo = await findVideoIdByUser(userId, videoId, token);
        const doesStatsExist = findVideo?.length > 0;

        if (req.method === 'POST') {
            const { favorited, watched = true } = req.body;

            if (doesStatsExist) {
                const response = await updateStats(token, {
                    favorited,
                    watched,
                    userId,
                    videoId,
                });
                return res.send({ done: true, data: response });
            } else {
                const response = await insertStats(token, {
                    favorited,
                    watched,
                    userId,
                    videoId,
                });
                return res.send({ done: true, data: response });
            }
        } else {
            if (doesStatsExist) {
                return res.send({ done: true, findVideo });
            } else {
                return res.status(404).send({ done: false, error: 'Stats not found' });
            }
        }
    }  catch (error) {
        res.status(500).send({ done: false, error: error?.message });
    }
}
