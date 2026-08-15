import { useState, useEffect, useRef, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import styles from './Contact.module.css';
import { Card } from '../../components';
import { Button } from '../../components';
import socialLinks from '../../data/socialLinks';
import personalInfo from '../../data/personalInfo';

const COOLDOWN_MS = 5 * 60 * 1000;

function getRemainingCooldown(): number {
  try {
    const last = localStorage.getItem('portfolio_last_sent');
    if (!last) return 0;
    const elapsed = Date.now() - Number(last);
    return Math.max(0, COOLDOWN_MS - elapsed);
  } catch {
    return 0;
  }
}

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function Contact() {
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [cooldown, setCooldown] = useState(getRemainingCooldown);
  const hpRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(timerRef.current);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  function validate(): boolean {
    const errs = { email: '', title: '', message: '' };
    if (!validateEmail(email)) errs.email = 'Please enter a valid email address';
    if (title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return !errs.email && !errs.title && !errs.message;
  }

  function handleBlur(field: 'email' | 'title' | 'message') {
    const val = field === 'email' ? email : field === 'title' ? title : message;
    const errs = { ...errors };
    if (field === 'email' && !validateEmail(val)) errs.email = 'Please enter a valid email address';
    else if (field === 'email') errs.email = '';
    if (field === 'title' && val.trim().length < 5 && val.length > 0) errs.title = 'Title must be at least 5 characters';
    else if (field === 'title') errs.title = '';
    if (field === 'message' && val.trim().length < 10 && val.length > 0) errs.message = 'Message must be at least 10 characters';
    else if (field === 'message') errs.message = '';
    setErrors(errs);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (cooldown > 0) return;

    // Honeypot check
    if (hpRef.current?.value) return;

    setSubmitting(true);
    setStatus('idle');

    try {
      await emailjs.send(
        personalInfo.emailjs.serviceId,
        personalInfo.emailjs.templateId,
        {
          from_email: email.trim(),
          title: title.trim(),
          message: message.trim(),
        },
        personalInfo.emailjs.publicKey,
      );

      setStatus('sent');
      setEmail('');
      setTitle('');
      setMessage('');
      setErrors({ email: '', title: '', message: '' });
      try {
        localStorage.setItem('portfolio_last_sent', String(Date.now()));
      } catch { /* ignore */ }
      setCooldown(COOLDOWN_MS);
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  function formatCooldown(ms: number) {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Contact</h2>
      <p className={styles.subtitle}>Get in touch</p>

      <Card className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Honeypot — invisible to humans */}
          <input
            ref={hpRef}
            type="text"
            name="_hp"
            tabIndex={-1}
            autoComplete="off"
            className={styles.hp}
          />

          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              required
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              required
            />
            {errors.title && <p className={styles.error}>{errors.title}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="message" className={styles.label}>Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onBlur={() => handleBlur('message')}
              className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
              required
            />
            {errors.message && <p className={styles.error}>{errors.message}</p>}
          </div>

          {cooldown > 0 && (
            <p className={styles.cooldown}>
              Please wait {formatCooldown(cooldown)} before sending another message
            </p>
          )}

          {status === 'sent' && (
            <p className={styles.success}>Message sent successfully!</p>
          )}
          {status === 'error' && (
            <p className={styles.errorMsg}>Failed to send. Please try again later.</p>
          )}

          <Button
            variant="primary"
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || cooldown > 0}
          >
            {submitting ? 'Sending...' : 'Send message'}
          </Button>
        </form>
      </Card>

      <div className={styles.socialRow}>
        {socialLinks.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialCircle}
            aria-label={link.label}
          >
            {link.label[0]}
          </a>
        ))}
      </div>
    </section>
  );
}
