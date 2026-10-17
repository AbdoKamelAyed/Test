import React, { useState } from 'react';
import { Phone, Mail, MessageSquare, MapPin, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { InquiryFormData, Language, Theme } from '../types';
import { translations } from '../data/translations';
import { validateInquiryForm } from '../utils/portfolioLogic';

interface ContactScreenProps {
  language: Language;
  theme: Theme;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ language, theme }) => {
  const t = translations[language];
  const isDark = theme === 'dark';
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    projectType: 'villas',
    estimatedArea: '500',
    location: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateInquiryForm(formData, language);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const handleOpenWhatsApp = () => {
    const text =
      language === 'ar'
        ? `مرحباً دُسُر للعمارة والتصميم، أود الاستفسار حول تصميم مشروع جديد.`
        : `Hello DUSUR Architecture Studio, I would like to inquire regarding a bespoke architectural commission.`;
    window.open(`https://wa.me/971501234567?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-col pb-24 px-4 pt-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold tracking-tight">
          {t.contactTitle}
        </h1>
        <p
          className={`text-xs mt-1 leading-relaxed ${
            isDark ? 'text-stone-400' : 'text-stone-600'
          }`}
        >
          {t.contactDesc}
        </p>
      </div>

      {/* Direct Contact Channels Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
        {/* WhatsApp */}
        <button
          onClick={handleOpenWhatsApp}
          className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-600/20 transition-all text-start"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MessageSquare size={17} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold opacity-70">WhatsApp</span>
            <div className="text-xs font-bold truncate">{t.chatWhatsApp}</div>
          </div>
        </button>

        {/* Telephone */}
        <a
          href="tel:+97142345678"
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-start ${
            isDark
              ? 'bg-stone-900 border-stone-800 text-stone-200 hover:border-stone-700'
              : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
            <Phone size={17} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold opacity-70">+971 4 234 5678</span>
            <div className="text-xs font-bold truncate">{t.callUs}</div>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:contact@dusur.me"
          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-start ${
            isDark
              ? 'bg-stone-900 border-stone-800 text-stone-200 hover:border-stone-700'
              : 'bg-white border-stone-200 text-stone-800 hover:border-stone-300'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-stone-700 text-white flex items-center justify-center shrink-0">
            <Mail size={17} />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold opacity-70">contact@dusur.me</span>
            <div className="text-xs font-bold truncate">{t.emailUs}</div>
          </div>
        </a>
      </div>

      {/* Consultation Request Form */}
      <div
        className={`p-4 rounded-2xl border transition-colors ${
          isDark ? 'bg-stone-900/80 border-stone-800' : 'bg-white border-stone-200 shadow-xs'
        }`}
      >
        <h2 className="text-sm font-bold tracking-tight mb-3">
          {language === 'ar' ? 'نموذج دراسة وتصميم المشروع' : 'Commission Brief & Consultation Request'}
        </h2>

        {submitted ? (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3">
              <CheckCircle2 size={26} />
            </div>
            <h3 className="text-sm font-bold text-emerald-500">
              {language === 'ar' ? 'تم تقديم الطلب بنجاح' : 'Inquiry Successfully Submitted'}
            </h3>
            <p
              className={`text-xs mt-2 max-w-sm leading-relaxed ${
                isDark ? 'text-stone-300' : 'text-stone-700'
              }`}
            >
              {t.formSuccess}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  projectType: 'villas',
                  estimatedArea: '500',
                  location: '',
                  notes: '',
                });
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
            >
              {language === 'ar' ? 'إرسال طلب مشروع آخر' : 'Submit Another Request'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-semibold opacity-80 mb-1">
                {t.formFullName} *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder={language === 'ar' ? 'الاسم الثلاثي أو اسم الشركة' : 'Full name or company name'}
                className={`w-full h-10 px-3 rounded-xl text-xs outline-none border transition-all ${
                  errors.fullName ? 'border-rose-500 bg-rose-500/5' : ''
                } ${
                  isDark
                    ? 'bg-stone-950 border-stone-800 text-stone-100 focus:border-amber-500'
                    : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                }`}
              />
              {errors.fullName && (
                <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle size={11} /> {errors.fullName}
                </span>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold opacity-80 mb-1">
                  {t.formEmail} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className={`w-full h-10 px-3 rounded-xl text-xs outline-none border transition-all ${
                    errors.email ? 'border-rose-500 bg-rose-500/5' : ''
                  } ${
                    isDark
                      ? 'bg-stone-950 border-stone-800 text-stone-100 focus:border-amber-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                  }`}
                />
                {errors.email && (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={11} /> {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold opacity-80 mb-1">
                  {t.formPhone} *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+971 50 000 0000"
                  className={`w-full h-10 px-3 rounded-xl text-xs outline-none border transition-all ${
                    errors.phone ? 'border-rose-500 bg-rose-500/5' : ''
                  } ${
                    isDark
                      ? 'bg-stone-950 border-stone-800 text-stone-100 focus:border-amber-500'
                      : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                  }`}
                />
                {errors.phone && (
                  <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                    <AlertCircle size={11} /> {errors.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Project Typology & Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold opacity-80 mb-1">
                  {t.formProjectType}
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className={`w-full h-10 px-3 rounded-xl text-xs outline-none border ${
                    isDark
                      ? 'bg-stone-950 border-stone-800 text-stone-100'
                      : 'bg-stone-50 border-stone-200 text-stone-900'
                  }`}
                >
                  <option value="villas">{language === 'ar' ? 'فيلات ومنازل فاخرة' : 'Luxury Villa'}</option>
                  <option value="compounds">{language === 'ar' ? 'مجمع سكني راقٍ' : 'Residential Compound'}</option>
                  <option value="commercial">{language === 'ar' ? 'مركز تجاري / مول' : 'Commercial / Retail Mall'}</option>
                  <option value="hospitality">{language === 'ar' ? 'كافيه أو مطعم متخصص' : 'Hospitality / Cafe'}</option>
                  <option value="fitness">{language === 'ar' ? 'نادي صحي ورياضي' : 'Fitness / Wellness Sanctuary'}</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold opacity-80 mb-1">
                  {t.formEstimatedArea}
                </label>
                <input
                  type="text"
                  value={formData.estimatedArea}
                  onChange={(e) => setFormData({ ...formData, estimatedArea: e.target.value })}
                  placeholder="e.g. 650"
                  className={`w-full h-10 px-3 rounded-xl text-xs outline-none border ${
                    isDark
                      ? 'bg-stone-950 border-stone-800 text-stone-100'
                      : 'bg-stone-50 border-stone-200 text-stone-900'
                  }`}
                />
              </div>
            </div>

            {/* Notes & Requirements */}
            <div>
              <label className="block text-[11px] font-semibold opacity-80 mb-1">
                {t.formNotes} *
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder={
                  language === 'ar'
                    ? 'اكتب نبذة عن رؤيتك للمشروع، التطلعات الجمالية، والموعد المأمول للبدء...'
                    : 'Describe your vision, site considerations, and key architectural desires...'
                }
                className={`w-full p-3 rounded-xl text-xs outline-none border transition-all ${
                  errors.notes ? 'border-rose-500 bg-rose-500/5' : ''
                } ${
                  isDark
                    ? 'bg-stone-950 border-stone-800 text-stone-100 focus:border-amber-500'
                    : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-amber-600'
                }`}
              />
              {errors.notes && (
                <span className="text-[10px] text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle size={11} /> {errors.notes}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs tracking-wide shadow-sm shadow-amber-900/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>{t.formSending}</span>
              ) : (
                <>
                  <span>{t.formSubmit}</span>
                  <ArrowIcon size={14} />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Studio Office Locations */}
      <div className="mt-6">
        <h3 className="text-xs font-bold tracking-tight mb-2.5 opacity-80 flex items-center gap-1.5">
          <MapPin size={14} className="text-amber-500" />
          <span>{t.ourStudios}</span>
        </h3>

        <div className="flex flex-col gap-2">
          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              isDark ? 'bg-stone-900/40 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <div className="font-bold text-amber-500 text-[11px] mb-0.5">
              {language === 'ar' ? 'استوديو دبي' : 'Dubai Studio'}
            </div>
            <div>{t.officeDubai}</div>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              isDark ? 'bg-stone-900/40 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <div className="font-bold text-amber-500 text-[11px] mb-0.5">
              {language === 'ar' ? 'استوديو أبوظبي' : 'Abu Dhabi Studio'}
            </div>
            <div>{t.officeAbuDhabi}</div>
          </div>

          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed ${
              isDark ? 'bg-stone-900/40 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'
            }`}
          >
            <div className="font-bold text-amber-500 text-[11px] mb-0.5">
              {language === 'ar' ? 'استوديو الرياض' : 'Riyadh Studio'}
            </div>
            <div>{t.officeRiyadh}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
