import { NextRequest, NextResponse } from 'next/server'
import iyzipay from '@/lib/iyzico/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, amount, buyer } = body

    // Dummy İyzico payment initialization
    // In production, you would use real İyzico API
    const paymentRequest = {
      locale: 'tr',
      conversationId: orderId,
      price: amount.toString(),
      paidPrice: amount.toString(),
      currency: 'TRY',
      basketId: orderId,
      paymentCard: {
        cardHolderName: buyer.name,
        cardNumber: '5528790000000008', // Dummy card
        expireMonth: '12',
        expireYear: '2030',
        cvc: '123',
      },
      buyer: {
        id: buyer.id,
        name: buyer.name,
        surname: buyer.name.split(' ')[1] || buyer.name,
        gsmNumber: buyer.phone,
        email: buyer.email,
        identityNumber: '11111111111',
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: 'Test Address',
        ip: '127.0.0.1',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34000',
      },
      shippingAddress: {
        contactName: buyer.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000',
      },
      billingAddress: {
        contactName: buyer.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000',
      },
      basketItems: [
        {
          id: orderId,
          name: 'Sipariş',
          category1: 'Genel',
          itemType: 'PHYSICAL',
          price: amount.toString(),
        },
      ],
    }

    // In a real implementation, you would call iyzipay.payment.create()
    // For now, we'll simulate a successful payment
    return NextResponse.json({
      success: true,
      paymentId: `dummy_${orderId}_${Date.now()}`,
      message: 'Ödeme başarıyla başlatıldı (Dummy)',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

