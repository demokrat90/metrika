'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import PhoneInput from '@/components/PhoneInput';
import './villas-fr.css';

type QuizStep = {
  id: number;
  title: string;
  options: string[];
};

type QuizAnswers = Record<number, string>;

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

const quizSteps: QuizStep[] = [
  {
    id: 0,
    title: 'Quel type de bien immobilier vous intéresse ?',
    options: ['Je ne sais pas encore', 'Villas', 'Maisons de ville'],
  },
  {
    id: 1,
    title: "Quel est votre objectif d'achat ?",
    options: ['Pour moi', 'Investissement'],
  },
  {
    id: 2,
    title: 'Combien de chambres souhaitez-vous ?',
    options: ['Je ne sais pas encore', '1 chambre', '2 chambres', '3 chambres', '4 chambres et plus'],
  },
  {
    id: 3,
    title: 'Indiquez une fourchette de prix acceptable',
    options: [
      '816 900 $ - 1 000 000 $',
      '1 000 000 $ - 1 500 000 $',
      '1 500 000 $ - 2 000 000 $',
      '2 000 000 $ - 4 000 000 $',
      '4 000 000 $ et plus',
    ],
  },
  {
    id: 4,
    title: 'Date de livraison du projet ?',
    options: ['Nouveau lancement', '2026', '2027', '2028', '2029', '2030'],
  },
  {
    id: 5,
    title: 'Comment préférez-vous être contacté pour discuter de votre demande ?',
    options: ['Appel téléphonique', 'WhatsApp', 'Telegram'],
  },
];

export default function VillasFrLanding() {
  const [showModal, setShowModal] = useState(false);

  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalState, setModalState] = useState<SubmitState>('idle');
  const [modalError, setModalError] = useState('');

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quizState, setQuizState] = useState<SubmitState>('idle');
  const [quizError, setQuizError] = useState('');

  useEffect(() => {
    const previousDir = document.documentElement.getAttribute('dir');
    const previousBodyDir = document.body.style.direction;
    const previousBodyAlign = document.body.style.textAlign;

    document.documentElement.setAttribute('dir', 'ltr');
    document.body.style.direction = 'ltr';
    document.body.style.textAlign = 'left';

    return () => {
      if (previousDir) {
        document.documentElement.setAttribute('dir', previousDir);
      } else {
        document.documentElement.removeAttribute('dir');
      }
      document.body.style.direction = previousBodyDir;
      document.body.style.textAlign = previousBodyAlign;
    };
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const totalSteps = quizSteps.length + 1;
  const inContactStep = currentStep === quizSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const modalDisabled = useMemo(
    () => modalState === 'sending' || !modalName.trim() || !modalPhone.trim(),
    [modalName, modalPhone, modalState],
  );

  const quizDisabled =
    quizState === 'sending' ||
    !fullName.trim() ||
    !phone.trim() ||
    quizSteps.some((step) => !answers[step.id]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalError('');
    setModalState('idle');
  };

  const submitPopup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (modalDisabled) return;

    setModalState('sending');
    setModalError('');

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: modalName.trim(),
          phone: modalPhone.trim(),
          category: 'Villas FR - Offres',
          source: 'villas-fr-popup',
          trackingCookies: typeof document !== 'undefined' ? document.cookie : '',
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message || "Échec de l'envoi du formulaire.");
      }

      setModalState('success');
      setModalName('');
      setModalPhone('');
      setModalEmail('');
    } catch (error) {
      setModalState('error');
      setModalError(error instanceof Error ? error.message : "Erreur d'envoi.");
    }
  };

  const handleOptionClick = (value: string) => {
    const stepId = quizSteps[currentStep]?.id;
    if (stepId === undefined) return;

    setAnswers((prev) => ({ ...prev, [stepId]: value }));
    if (currentStep < quizSteps.length) {
      setTimeout(() => {
        setCurrentStep((prev) => Math.min(quizSteps.length, prev + 1));
      }, 180);
    }
  };

  const submitQuiz = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (quizDisabled) {
      return;
    }

    setQuizState('sending');
    setQuizError('');

    const payload = {
      ...answers,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      trackingCookies: typeof document !== 'undefined' ? document.cookie : '',
    };

    try {
      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const responsePayload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(responsePayload?.message || "Le formulaire n'a pas pu être envoyé.");
      }

      setQuizState('success');
      setCurrentStep(0);
      setAnswers({});
      setFullName('');
      setPhone('');
      setEmail('');
    } catch (error) {
      setQuizState('error');
      setQuizError(error instanceof Error ? error.message : 'Erreur de connexion au serveur.');
    }
  };

  return (
    <main className="vf-page" dir="ltr">
      <header className="vf-header">
        <a href="#" className="vf-logo" aria-label="Metrika">
          <Image src="/images/logo.png" alt="Metrika" width={500} height={210} />
        </a>
      </header>

      <section className="vf-hero">
        <div className="vf-hero__content">
          <h1>
            Villas et maisons
            <br />
            de ville à Dubaï
          </h1>
          <p className="vf-hero__price">Villas et maisons de ville à partir de 816 900 $</p>
          <p className="vf-hero__sub">Recevez les offres les plus récentes avec les prix en 1 minute.</p>
          <button className="vf-btn vf-btn--gold" type="button" onClick={openModal}>
            OBTENIR LES OFFRES
          </button>
        </div>
        <div className="vf-hero__media" aria-hidden="true" />
      </section>

      <section className="vf-info">
        <div className="vf-info__inner">
          <div className="vf-info__media">
            <Image src="/images/rectangle-43-1.jpg" alt="Skyline de Dubaï" width={1000} height={1490} />
          </div>
          <div className="vf-info__content">
            <h2>Investissez aux Émirats arabes unis en toute sécurité et de manière rentable</h2>
            <ul>
              <li>Demande locative élevée toute l&apos;année</li>
              <li>Rendement moyen de 6 à 9 % selon l&apos;emplacement et le type de bien</li>
              <li>Propriété en pleine propriété pour les étrangers dans les zones autorisées</li>
              <li>Supervision RERA et comptes séquestres pour les projets sur plan</li>
              <li>Dirham indexé sur le dollar américain, réduisant le risque de change</li>
              <li>Paiements flexibles chez les promoteurs, y compris après livraison</li>
              <li>Infrastructures de classe mondiale et connectivité internationale</li>
              <li>Marché primaire et secondaire liquide</li>
              <li>0 % de commission à l&apos;achat direct auprès des promoteurs</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="vf-benefits">
        <div className="vf-benefits__inner">
          <article className="vf-benefit-card">
            <p className="vf-benefit-card__eyebrow">économies fiscales</p>
            <div className="vf-benefit-card__row">
              <span className="vf-benefit-card__value">0 %</span>
              <p>impôt sur les plus-values à la revente (pour les particuliers)</p>
            </div>
            <div className="vf-benefit-card__divider" />
            <div className="vf-benefit-card__row">
              <span className="vf-benefit-card__value">0 %</span>
              <p>impôt sur le revenu locatif pour les personnes physiques</p>
            </div>
          </article>

          <article className="vf-benefit-card">
            <p className="vf-benefit-card__eyebrow">résidence via l&apos;immobilier</p>
            <div className="vf-benefit-card__stack">
              <p>
                <strong>Visa investisseur (2 ans) :</strong>
                <br />
                à partir de 750 000 AED de valeur immobilière
              </p>
              <div className="vf-benefit-card__divider" />
              <p>
                <strong>Golden Visa (10 ans) :</strong>
                <br />
                à partir de 2 000 000 AED de valeur immobilière
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="vf-quiz" id="quiz">
        <div className="vf-quiz__inner">
          <div className="vf-progress">
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="vf-step">Étape : {currentStep + 1} / {totalSteps}</p>

          <form onSubmit={submitQuiz} className="vf-form">
            {!inContactStep && (
              <div className="vf-form__step vf-form__step--quiz">
                <div className="vf-step-layout">
                  <h2>{quizSteps[currentStep].title}</h2>
                  <div className="vf-step-layout__right">
                    <div className="vf-options">
                      {quizSteps[currentStep].options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`vf-option ${answers[quizSteps[currentStep].id] === option ? 'is-active' : ''}`}
                          onClick={() => handleOptionClick(option)}
                        >
                          <span className="vf-option__dot" aria-hidden="true" />
                          <span className="vf-option__label">{option}</span>
                        </button>
                      ))}
                    </div>

                    <div className="vf-actions vf-actions--step">
                      <button
                        type="button"
                        className="vf-btn vf-btn--ghost"
                        onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                      >
                        Retour
                      </button>
                      <button
                        type="button"
                        className="vf-btn vf-btn--gold"
                        onClick={() => setCurrentStep((prev) => Math.min(quizSteps.length, prev + 1))}
                        disabled={!answers[quizSteps[currentStep].id]}
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {inContactStep && (
              <div className="vf-form__step vf-form__step--contact">
                <h2>Indiquez votre nom et votre téléphone pour recevoir la sélection</h2>
                <div className="vf-contact-grid">
                  <label>
                    Nom
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Votre nom"
                      required
                    />
                  </label>
                  <label>
                    Téléphone
                    <PhoneInput
                      value={phone}
                      onChange={setPhone}
                      placeholder="00 00 00 00"
                    />
                  </label>
                  <label>
                    E-mail (optionnel)
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="email@exemple.com"
                    />
                  </label>
                </div>

                <div className="vf-actions">
                  <button
                    type="button"
                    className="vf-btn vf-btn--ghost"
                    onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  >
                    Retour
                  </button>
                  <button type="submit" className="vf-btn vf-btn--gold vf-btn--quiz-submit" disabled={quizDisabled}>
                    {quizState === 'sending' ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </div>
            )}

            {quizState === 'success' && (
              <p className="vf-status vf-status--ok" role="status" aria-live="polite">
                Merci. Vos informations ont été envoyées avec succès.
              </p>
            )}
            {quizState === 'error' && (
              <p className="vf-status vf-status--err" role="alert">
                {quizError}
              </p>
            )}
          </form>
        </div>
      </section>

      <footer className="vf-footer" id="contacts">
        <div className="vf-footer__inner">
          <div className="vf-footer__brand">
            <Image src="/images/logo.png" alt="Metrika" width={160} height={54} />
          </div>
          <div className="vf-footer__col vf-footer__col--contact">
            <p>Dubai, The Onyx Tower 2, office 1004</p>
            <a href="mailto:metrika.realestate@metrika.ae">metrika.realestate@metrika.ae</a>
            <a href="tel:+97143376775">+971 4 337 67 75</a>
          </div>
          <div className="vf-footer__col vf-footer__col--legal">
            <a href="/privacy-policy">Politique de confidentialité</a>
            <a href="/cookie-policy">Politique des cookies</a>
            <a href="/terms_of_use">Conditions d&apos;utilisation</a>
          </div>
          <div className="vf-footer__col vf-footer__col--cta">
            <button className="vf-btn vf-btn--gold" type="button" onClick={openModal}>
              DEMANDER UN RAPPEL
            </button>
          </div>
        </div>
      </footer>

      {showModal && (
        <div className="vf-modal" role="dialog" aria-modal="true" aria-label="Obtenir les offres">
          <div className="vf-modal__backdrop" onClick={closeModal} />
          <div className="vf-modal__panel">
            <button type="button" className="vf-modal__close" aria-label="Fermer" onClick={closeModal}>
              ×
            </button>
            <h3>OBTENIR LES OFFRES</h3>
            <p>Recevez une présentation avec les informations, biens et prix à jour.</p>

            <form onSubmit={submitPopup} className="vf-modal__form">
              <label>
                Nom
                <input
                  type="text"
                  value={modalName}
                  onChange={(event) => setModalName(event.target.value)}
                  placeholder="Nom"
                  required
                />
              </label>
              <label>
                Téléphone
                <PhoneInput
                  value={modalPhone}
                  onChange={setModalPhone}
                  placeholder="00 00 00 00"
                />
              </label>
              <label>
                E-mail (optionnel)
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(event) => setModalEmail(event.target.value)}
                  placeholder="email@exemple.com"
                />
              </label>

              <button type="submit" className="vf-btn vf-btn--gold" disabled={modalDisabled}>
                {modalState === 'sending' ? 'Envoi...' : 'OBTENIR LES OFFRES'}
              </button>

              {modalState === 'success' && (
                <p className="vf-status vf-status--ok" role="status" aria-live="polite">
                  Merci. Vos informations ont été envoyées avec succès.
                </p>
              )}
              {modalState === 'error' && (
                <p className="vf-status vf-status--err" role="alert">
                  {modalError}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
