import { NextRequest, NextResponse } from 'next/server';
import { isAmoConfigured, submitAmoLead } from '@/lib/amocrm';
import { buildRequestContextNote } from '@/lib/request-context';

interface LeadData {
  fullName: string;
  phone: string;
  category: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: LeadData = await request.json();
    const requestContextNote = buildRequestContextNote(request);
    const amoConfigured = isAmoConfigured();
    let amoSynced = !amoConfigured;
    let amoError = '';

    // Log the submission (for development)
    console.log('Lead submission:', {
      name: data.fullName,
      phone: data.phone,
      category: data.category,
      source: data.source,
    });

    // If AmoCRM is configured, send the lead
    if (amoConfigured) {
      try {
        await submitAmoLead({
          leadName: `${data.category} - ${data.fullName}`,
          tags: ['Arab'],
          noteText: [
            'Lead source: popup form',
            `Full name: ${data.fullName}`,
            `Phone: ${data.phone}`,
            'Email: -',
            '',
            requestContextNote,
          ].join('\n'),
          contact: {
            fullName: data.fullName,
            phone: data.phone,
          },
        });
        amoSynced = true;
      } catch (amoCrmError) {
        console.error('Error sending to AmoCRM:', amoCrmError);
        amoError = amoCrmError instanceof Error ? amoCrmError.message : 'Unknown AmoCRM error';
      }
    }

    if (!amoSynced) {
      return NextResponse.json(
        {
          success: false,
          message: 'AmoCRM rejected the lead',
          amoSynced: false,
          amoError,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
      amoSynced: true,
      gtmEvent: {
        event: 'lead_submit',
        formName: 'popup',
        category: data.category,
      },
    });
  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing submission' },
      { status: 500 }
    );
  }
}
