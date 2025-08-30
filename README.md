# Personal Portfolio Website

A modern, responsive portfolio website built with Next.js and Tailwind CSS. This single-page application showcases your projects, skills, and contact information with smooth animations and a clean design.

## Features

- 🎨 Modern and minimalistic design
- 📱 Fully responsive layout
- ⚡ Built with Next.js 14 and Tailwind CSS
- 🎭 Smooth animations using Framer Motion
- 📝 Easy to customize content
- 🔍 SEO optimized
- 🚀 Fast performance
- 📧 Working contact form with EmailJS integration

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up EmailJS:
   - Create an account at [EmailJS](https://www.emailjs.com/)
   - Create an email service (Gmail, Outlook, etc.)
   - Create an email template
   - Get your Service ID, Template ID, and Public Key
   - Update the `src/config/emailjs.ts` file with your credentials:
     ```typescript
     export const EMAILJS_CONFIG = {
         SERVICE_ID: 'your_service_id',
         TEMPLATE_ID: 'your_template_id',
         PUBLIC_KEY: 'your_public_key',
     };
     ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Customization

### Personal Information

1. Update the metadata in `src/app/layout.tsx`
2. Modify the content in the following components:
   - `src/components/Hero.tsx`: Update name and title
   - `src/components/About.tsx`: Update bio, experience, and skills
   - `src/components/Projects.tsx`: Add your projects
   - `src/components/Contact.tsx`: Update contact information and social links

### Styling

- The website uses Tailwind CSS for styling
- Colors and other design elements can be modified in the component files
- Global styles can be updated in `src/app/globals.css`

### Contact Form

The contact form is now fully functional using EmailJS:

1. Make sure you've set up your EmailJS credentials in `src/config/emailjs.ts`
2. The form will automatically handle:
   - Form validation
   - Loading states
   - Success/error messages
   - Email sending through EmailJS

## Deployment

The easiest way to deploy your portfolio is using the [Vercel Platform](https://vercel.com/new).

## Technologies Used

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [EmailJS](https://www.emailjs.com/)

## License

This project is open source and available under the [MIT License](LICENSE).
