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
}

export const quizSteps: QuizStep[] = [
  {
    id: 0,
    title: 'طريقة الدفع المفضلة',
    type: 'single',
    options: [
      { id: 'cash', label: 'نقداً', value: 'نقداً' },
      { id: 'installments', label: 'أقساط بدون فوائد', value: 'أقساط بدون فوائد' },
    ],
  },
  {
    id: 1,
    title: 'المبلغ المستثمر',
    type: 'single',
    options: [
      { id: 'under-750k', label: 'أقل من 750,000 درهم', value: 'أقل من 750,000 درهم' },
      { id: '750k-1m', label: '750,000 - 1,000,000 درهم', value: '750,000 - 1,000,000 درهم' },
      { id: '1m-1.5m', label: '1,000,000 - 1,500,000 درهم', value: '1,000,000 - 1,500,000 درهم' },
      { id: '1.5m-2.5m', label: '1,500,000 - 2,500,000 درهم', value: '1,500,000 - 2,500,000 درهم' },
      { id: 'over-2.5m', label: 'أكثر من 2,500,000 درهم', value: 'أكثر من 2,500,000 درهم' },
    ],
  },
  {
    id: 2,
    title: 'فترة الاستثمار',
    type: 'single',
    options: [
      { id: '1yr', label: 'سنة واحدة', value: 'سنة واحدة' },
      { id: '2-3yr', label: '2-3 سنوات', value: '2-3 سنوات' },
      { id: '4-5yr', label: '4-5 سنوات', value: '4-5 سنوات' },
      { id: '5-10yr', label: '5-10 سنوات', value: '5-10 سنوات' },
    ],
  },
  {
    id: 3,
    title: 'كم عدد غرف النوم',
    type: 'single',
    options: [
      { id: 'studio', label: 'استوديو', value: 'استوديو' },
      { id: '1br', label: 'غرفة نوم واحدة', value: 'غرفة نوم واحدة' },
      { id: '2br', label: 'غرفتي نوم', value: 'غرفتي نوم' },
      { id: '3br', label: '3 غرف نوم', value: '3 غرف نوم' },
      { id: '4br+', label: '4 غرف نوم أو أكثر', value: '4 غرف نوم أو أكثر' },
    ],
  },
  {
    id: 4,
    title: 'ما هو الغرض من الشراء',
    type: 'single',
    options: [
      { id: 'investment', label: 'استثمار', value: 'استثمار' },
      { id: 'living', label: 'للسكن', value: 'للسكن' },
      { id: 'both', label: 'كلاهما', value: 'كلاهما' },
    ],
  },
  {
    id: 5,
    title: 'الميزانية المطلوبة',
    type: 'single',
    options: [
      { id: 'budget-750k-1m', label: '750,000 - 1,000,000 درهم', value: '750K-1M' },
      { id: 'budget-1m-1.5m', label: '1,000,000 - 1,500,000 درهم', value: '1M-1.5M' },
      { id: 'budget-1.5m-2.5m', label: '1,500,000 - 2,500,000 درهم', value: '1.5M-2.5M' },
      { id: 'budget-over-2.5m', label: 'أكثر من 2,500,000 درهم', value: '>2.5M' },
    ],
  },
  {
    id: 6,
    title: 'حالة العقار',
    type: 'single',
    options: [
      { id: 'ready', label: 'جاهز للتسليم', value: 'جاهز للتسليم' },
      { id: 'off-plan', label: 'على الخارطة', value: 'على الخارطة' },
      { id: 'any-status', label: 'أي حالة', value: 'أي حالة' },
    ],
  },
  {
    id: 7,
    title: 'كيف تفضل الاتصال',
    type: 'contact',
    options: [
      { id: 'whatsapp', label: 'واتساب', value: 'واتساب' },
      { id: 'call', label: 'مكالمة هاتفية', value: 'مكالمة هاتفية' },
    ],
    fields: [
      {
        name: 'fullName',
        label: 'الاسم الكامل',
        type: 'text',
        placeholder: 'أدخل اسمك الكامل',
        required: true,
      },
      {
        name: 'phone',
        label: 'رقم الهاتف',
        type: 'tel',
        placeholder: '50 123 4567',
        required: true,
      },
    ],
  },
];

export type QuizAnswers = {
  [key: number]: string | string[];
  fullName?: string;
  phone?: string;
  contactMethod?: string;
};
