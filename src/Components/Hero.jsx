import profileImg from '../img/profilepic.png'

const Hero = () => {
    return (
        <section id="hero" className='p-8 md:p-12 flex flex-col md:flex-row justify-center items-center space-y-6 md:space-x-12'>
            <div className='flex-shrink-0'>
                <img src={profileImg} alt="" className='w-48 h-52 rounded-full border-2 border-acc-l dark:border-acc-d' />
            </div>

            <div className='text-center md:text-left max-w-5xl'>
                <h1 className='text-2xl md:text-4xl'>Hi, my name is</h1>
                <h2 className='text-3xl md:text-5xl font-bold text-acc-l dark:text-acc-d'>Christopher Gunawan</h2>
                <span className='text-xl font-medium mt-2'>A student at Binus University</span>
                <p className='leading-relaxed'>
                I’m a 20-year-old Computer Science student with a strong background in programming, problem-solving, and multiple coding languages. Over the course of my studies, I've developed proficiency in Python and C, as well as web development skills using HTML, CSS (TailwindCSS), and JavaScript (ReactJS). I’m enthusiastic about applying my skills to real-world projects and collaborating with others to broaden my experience and knowledge.
                </p>

                <button className='mt-4 md:mt-2 px-6 py-2 rounded-lg bg-acc-l hover:bg-indigo-600 shadow-md text-white dark:bg-acc-d hover:dark:bg-indigo-600 transition-all'>
                    <a href="#contacts">Contact Me</a>
                </button>
            </div>
        </section>
    );
};

export default Hero;