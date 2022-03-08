// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';
import dbConnect from '../../utils/database';
import {getSession} from 'next-auth/react';
import Tab from '../../models/Tab';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const session = await getSession({req});
    if (!session) return res.status(401).send('');
    await dbConnect();
    //@ts-ignore
    const tab = await Tab.findOne({$eq: {userId: session.account.sub}});

    if (req.method === 'POST') {
        if (!tab) {
            const newTab = await Tab.create({
                //@ts-ignore
                userId: session.account.sub,
                tabs: JSON.parse(req.body).tabs,
                provider: 'github',
            });
            await newTab.save();
            return res.status(200).json(newTab);
        } else {
            const updated = await Tab.findOneAndUpdate(
                //@ts-ignore
                {$eq: {userId: session.account.sub}},
                {
                    //@ts-ignore
                    userId: session.account.sub,
                    tabs: JSON.parse(req.body).tabs,
                    provider: 'github',
                },
            );
            await updated.save();
            return res.status(200).json(updated);
        }
    }
    if (req.method === 'GET') {
        return res.status(200).json(tab);
    }
}
