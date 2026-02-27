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
    title: 'كم عدد غرف النوم التي تريدها؟',
    type: 'single',
    options: [
      { id: 'does-not-matter', label: 'لا يهم', value: 'لا يهم' },
      { id: '1-bedroom', label: 'غرفة نوم واحدة', value: 'غرفة نوم واحدة' },
      { id: '2-bedroom', label: 'غرفتي نوم', value: 'غرفتي نوم' },
      { id: '3-bedroom', label: 'ثلاث غرف نوم', value: 'ثلاث غرف نوم' },
      { id: '4-bedroom-more', label: 'أربع غرف نوم وأكثر', value: 'أربع غرف نوم وأكثر' },
    ],
  },
  {
    id: 1,
    title: 'ما هو الغرض من الشراء؟',
    type: 'single',
    options: [
      { id: 'personal-use', label: 'الاستخدام الشخصي', value: 'الاستخدام الشخصي' },
      { id: 'investing', label: 'للاستثمار', value: 'للاستثمار' },
    ],
  },
  {
    id: 2,
    title: 'يرجى اختيار الميزانية المطلوبة',
    type: 'single',
    options: [
      { id: '750k-1m-aed', label: '750,000 - 1,000,000 درهم', value: '750,000 - 1,000,000 درهم' },
      { id: '1m-1.5m-aed', label: '1,000,000 - 1,500,000 درهم', value: '1,000,000 - 1,500,000 درهم' },
      { id: '1.5m-2.5m-aed', label: '1,500,000 - 2,500,000 درهم', value: '1,500,000 - 2,500,000 درهم' },
      { id: 'over-2.5m-aed', label: '> 2,500,000 درهم', value: '> 2,500,000 درهم' },
    ],
  },
  {
    id: 3,
    title: 'ما هي حالة العقار الذي ترغب في شرائه',
    type: 'single',
    options: [
      { id: 'ready', label: 'جاهز', value: 'جاهز' },
      { id: 'under-construction', label: 'قيد الإنشاء', value: 'قيد الإنشاء' },
    ],
  },
  {
    id: 4,
    title: 'ما هي طريقة الدفع المفضلة لديك',
    type: 'single',
    options: [
      { id: 'cash', label: 'نقداً', value: 'نقداً' },
      { id: 'developer-installments', label: 'دفع الأقساط من المطور', value: 'دفع الأقساط من المطور' },
      {
        id: 'bank-installments-uae-residents',
        label: 'أقساط بنكية (للمقيمين في الإمارات العربية المتحدة)',
        value: 'أقساط بنكية (للمقيمين في الإمارات العربية المتحدة)',
      },
    ],
  },
  {
    id: 5,
    title: 'كيف تفضل أن يتم الاتصال بك لمناقشة استفسارك بشكل أفضل؟',
    type: 'single',
    options: [
      { id: 'phone-call', label: 'مكالمة هاتفية', value: 'مكالمة هاتفية' },
      { id: 'whatsapp', label: 'من خلال تطبيق واتس آب', value: 'من خلال تطبيق واتس آب' },
      { id: 'telegram', label: 'من خلال تطبيق تيليجرام', value: 'من خلال تطبيق تيليجرام' },
    ],
  },
  {
    id: 6,
    title: 'معلومات التواصل',
    type: 'contact',
    description: 'يرجى إدخال الاسم ورقم الهاتف الذي سنرسل إليه الخيارات',
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
  landing?: string;
  trackingCookies?: string;
};
