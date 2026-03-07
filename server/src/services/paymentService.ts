import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface InitializeTransactionParams {
    email: string;
    amount: number; // in Kobo (100 kobo = 1 Naira)
    metadata?: any;
    callback_url?: string;
}

/**
 * Initializes a transaction with Paystack
 */
export const initializeTransaction = async (params: InitializeTransactionParams) => {
    try {
        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            params,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Paystack Initialize Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to initialize payment');
    }
};

/**
 * Verifies a transaction with Paystack
 */
export const verifyTransaction = async (reference: string) => {
    try {
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Paystack Verify Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to verify payment');
    }
};
