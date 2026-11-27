import crypto from 'crypto';
import { AppError } from '../utils/app-error.util.js';

export interface MidtransCustomerDetails {
  first_name: string;
  email: string;
  phone?: string;
}

export interface SnapTransactionParams {
  orderNumber: string;
  grossAmount: number;
  customerDetails: MidtransCustomerDetails;
  finishRedirectUrl: string;
}

export class MidtransService {
  ensureConfigured(): void {
    this.getServerKey();
  }

  async createSnapToken(
    params: SnapTransactionParams
  ): Promise<{ snapToken: string; redirectUrl: string }> {
    const serverKey = this.getServerKey();
    const grossAmount = Math.round(params.grossAmount);

    if (!Number.isSafeInteger(grossAmount) || grossAmount <= 0) {
      throw new AppError('Order total is invalid for Midtrans payment.', 400);
    }

    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    const snapApiUrl = isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
    const authorization = Buffer.from(`${serverKey}:`).toString('base64');

    let response: Response;
    try {
      response = await fetch(snapApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${authorization}`,
        },
        body: JSON.stringify({
          transaction_details: {
            order_id: params.orderNumber,
            gross_amount: grossAmount,
          },
          customer_details: {
            first_name: params.customerDetails.first_name,
            email: params.customerDetails.email,
            ...(params.customerDetails.phone ? { phone: params.customerDetails.phone } : {}),
          },
          callbacks: { finish: params.finishRedirectUrl },
        }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new AppError('Midtrans payment gateway is currently unreachable.', 502);
    }

    if (!response.ok) {
      throw new AppError(`Midtrans rejected the payment request (HTTP ${response.status}).`, 502);
    }

    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== 'object' ||
      !('token' in result) ||
      typeof result.token !== 'string' ||
      !('redirect_url' in result) ||
      typeof result.redirect_url !== 'string'
    ) {
      throw new AppError('Midtrans returned an invalid payment response.', 502);
    }

    return { snapToken: result.token, redirectUrl: result.redirect_url };
  }

  convertUsdToIdr(amount: number): number {
    return Math.round(amount);
  }

  verifySignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    signatureKey: string
  ): boolean {
    let serverKey: string;
    try {
      serverKey = this.getServerKey();
    } catch {
      return false;
    }

    if (!/^[a-f\d]{128}$/i.test(signatureKey)) return false;

    const expected = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest();
    const received = Buffer.from(signatureKey.toLowerCase(), 'hex');

    return received.length === expected.length && crypto.timingSafeEqual(received, expected);
  }

  private getServerKey(): string {
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    if (
      !serverKey ||
      /placeholder|your_midtrans|change_me/i.test(serverKey)
    ) {
      throw new AppError(
        'Midtrans belum dikonfigurasi. Isi MIDTRANS_SERVER_KEY di backend/.env.',
        503
      );
    }
    return serverKey;
  }
}

export const midtransService = new MidtransService();
