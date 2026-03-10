import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getCloudinarySignature = async (req: Request, res: Response) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        // We can define a folder for Luxel uploads
        const paramsToSign = {
            timestamp,
            folder: 'luxel_tours',
        };

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET!
        );

        return res.json({
            signature,
            timestamp,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            folder: 'luxel_tours',
        });
    } catch (error) {
        console.error('Cloudinary signature error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
