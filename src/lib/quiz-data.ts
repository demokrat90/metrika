export interface QuizOption {
  id: string;
  label: string;
  value: string;
}

export interface QuizStep {
  id: number;
  title: string;
  type: 'single' | 'multiple' | 'contact';
  options?: QuizOption[];
  fields?: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
  }[];
  description?: string;
  checkboxLabel?: string;
}

export const quizSteps: QuizStep[] = [
  {
    id: 0,
    title: 'ما نوع العقار الذي تهتم به؟',
    type: 'single',
    options: [
      { id: 'dont-know-property', label: 'لا أعرف بعد', value: 'لا أعرف بعد' },
      { id: 'apartments', label: 'شقق', value: 'شقق' },
      { id: 'villas', label: 'فلل', value: 'فلل' },
      { id: 'townhouses', label: 'تاون هاوس', value: 'تاون هاوس' },
    ],
  },
  {
    id: 1,
    title: 'ما هدفك من الشراء؟',
    type: 'single',
    options: [
      { id: 'for-myself', label: 'لنفسي', value: 'لنفسي' },
      { id: 'investing', label: 'للاستثمار', value: 'للاستثمار' },
    ],
  },
  {
    id: 2,
    title: 'كم عدد غرف النوم التي تريدها؟',
    type: 'single',
    options: [
      { id: 'dont-know-bedrooms', label: 'لا أعرف بعد', value: 'لا أعرف بعد' },
      { id: '1-bedroom', label: 'غرفة نوم واحدة', value: 'غرفة نوم واحدة' },
      { id: '2-bedroom', label: 'غرفتا نوم', value: 'غرفتا نوم' },
      { id: '3-bedroom', label: '3 غرف نوم', value: '3 غرف نوم' },
      { id: '4-bedroom-more', label: '4 غرف نوم فأكثر', value: '4 غرف نوم فأكثر' },
    ],
  },
  {
    id: 3,
    title: 'حدد نطاق السعر المقبول',
    type: 'single',
    options: [
      { id: '250k-300k', label: '250,000$ - 300,000$', value: '250,000$ - 300,000$' },
      { id: '300k-500k', label: '300,000$ - 500,000$', value: '300,000$ - 500,000$' },
      { id: '500k-1m', label: '500,000$ - 1,000,000$', value: '500,000$ - 1,000,000$' },
      { id: '1m-1.5m', label: '1,000,000$ - 1,500,000$', value: '1,000,000$ - 1,500,000$' },
      { id: '1.5m-more', label: '1,500,000$ فأكثر', value: '1,500,000$ فأكثر' },
    ],
  },
  {
    id: 4,
    title: 'موعد تسليم المشروع أو الاستلام؟',
    type: 'single',
    options: [
      { id: 'new-launch', label: 'إطلاق جديد', value: 'إطلاق جديد' },
      { id: '2026', label: '2026', value: '2026' },
      { id: '2027', label: '2027', value: '2027' },
      { id: '2028', label: '2028', value: '2028' },
      { id: '2029', label: '2029', value: '2029' },
      { id: '2030', label: '2030', value: '2030' },
    ],
  },
  {
    id: 5,
    title: 'كيف تفضل أن نتواصل معك لمناقشة استفسارك بشكل أوسع؟',
    type: 'single',
    options: [
      { id: 'phone-call', label: 'عبر مكالمة هاتفية', value: 'عبر مكالمة هاتفية' },
      { id: 'whatsapp', label: 'عبر واتساب', value: 'عبر واتساب' },
      { id: 'telegram', label: 'عبر تيليجرام', value: 'عبر تيليجرام' },
    ],
  },
  {
    id: 6,
    title: 'معلومات التواصل',
    type: 'contact',
    description: 'يرجى إدخال الاسم ورقم الهاتف الذي سنرسل إليه الخيارات',
    checkboxLabel: 'أوافق على سياسة الخصوصية',
    fields: [
      {
        name: 'fullName',
        label: 'الاسم',
        type: 'text',
        placeholder: 'أدخل الاسم',
        required: true,
      },
      {
        name: 'phone',
        label: 'رقم الهاتف',
        type: 'tel',
        placeholder: '000-0000000',
        required: true,
      },
      {
        name: 'email',
        label: 'البريد الإلكتروني (اختياري)',
        type: 'email',
        placeholder: 'example@email.com',
        required: false,
      },
    ],
  },
];

export type QuizAnswers = {
  [key: number]: string | string[];
  fullName?: string;
  phone?: string;
  email?: string;
};
