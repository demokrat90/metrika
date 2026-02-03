import { NextRequest, NextResponse } from 'next/server';

// AmoCRM configuration - set these environment variables
const AMOCRM_SUBDOMAIN = process.env.AMOCRM_SUBDOMAIN;
const AMOCRM_ACCESS_TOKEN = process.env.AMOCRM_ACCESS_TOKEN;
const AMOCRM_PIPELINE_ID = process.env.AMOCRM_PIPELINE_ID;

interface LeadData {
  fullName: string;
  phone: string;
  category: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: LeadData = await request.json();

    // Log the submission (for development)
    console.log('Lead submission:', {
      name: data.fullName,
      phone: data.phone,
      category: data.category,
      source: data.source,
    });

    // If AmoCRM is configured, send the lead
    if (AMOCRM_SUBDOMAIN && AMOCRM_ACCESS_TOKEN) {
      try {
        const leadData = {
          source_name: `Popup - ${data.category}`,
          source_uid: `popup-${Date.now()}`,
          pipeline_id: AMOCRM_PIPELINE_ID ? parseInt(AMOCRM_PIPELINE_ID) : undefined,
          created_at: Math.floor(Date.now() / 1000),
          metadata: {
            form_name: 'Popup Form',
            form_page: 'metrika-clone.vercel.app',
          },
          _embedded: {
            leads: [
              {
                name: `${data.category} - ${data.fullName}`,
                custom_fields_values: [
                  {
                    field_name: 'فئة العقار',
                    values: [{ value: data.category }],
                  },
                  {
                    field_name: 'مصدر الطلب',
                    values: [{ value: data.source }],
                  },
                ],
              },
            ],
            contacts: [
              {
                name: data.fullName,
                first_name: data.fullName?.split(' ')[0] || '',
                last_name: data.fullName?.split(' ').slice(1).join(' ') || '',
                custom_fields_values: [
                  {
                    field_code: 'PHONE',
                    values: [{ value: data.phone, enum_code: 'MOB' }],
                  },
                ],
              },
            ],
          },
        };

        const response = await fetch(
          `https://${AMOCRM_SUBDOMAIN}/api/v4/leads/unsorted/forms`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${AMOCRM_ACCESS_TOKEN}`,
            },
            body: JSON.stringify([leadData]),
          }
        );

        if (!response.ok) {
          console.error('AmoCRM API error:', await response.text());
        }
      } catch (amoCrmError) {
        console.error('Error sending to AmoCRM:', amoCrmError);
        // Don't fail the request if AmoCRM fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
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
