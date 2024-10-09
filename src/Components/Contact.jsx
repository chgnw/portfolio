import ig from '../img/ig.png'
import github from '../img/github.png'
import linkedin from '../img/linkedin.png'
import x from '../img/x.png'

const Contact = () => {
  return (
    <footer id='contacts' className="bg-bgd-l dark:bg-bgd-d text-txt-l dark:text-txt-d py-10 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-4">
          Get in <span className="text-acc-l dark:text-acc-d">Touch</span>
        </h2>
        {/* Contact Info */}
        <p className="mb-4 text-txt-l dark:text-txt-d">
          I'd love to hear from you! Whether it’s a project, job opportunity, or just a chat. Feel free to reach out.
        </p>
        <a
          href="#"
          className="block text-text-l dark:text-text-d font-medium mb-4"
        >
          christopher.gunawan002@binus.ac.id
        </a>
        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-6">
          <a href="https://github.com/chgnw" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <img src={ig} alt="" className='w-6 h-6'/>
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <img src={linkedin} alt="" className='w-6 h-6'/>
          </a>
          <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <img src={github} alt="" className='w-6 h-6'/>
          </a>
          <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <img src={x} alt="" className='w-6 h-6'/>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Contact;