import { motion } from "framer-motion";

const aboutDetail = "I’m a 20-year-old Computer Science student with a strong background in programming, problem-solving, and multiple coding languages. Over the course of my studies, I've developed proficiency in C, Java, and Python, as well as web development skills using HTML, CSS, and JavaScript. I’m enthusiastic about applying my skills to real-world projects and collaborating with others to broaden my experience and knowledge."

const About = () => {
    return (
        <>
            <motion.section  variants={{ hidden: {opacity: 0}, show: {opacity: 1}, transition: {staggerChildren: 0.01} }} initial='hidden' animate='show' id="about" className="py-16">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <span className="text-3xl hover:underline underline-offset-4">About Me</span>

                    <p className="text-center text-[#d4d4d4] md:text-lg mx-8 md:mx-20 lg:mx-40">
                        {aboutDetail}
                    </p>
                </div>
            </motion.section>
        </>
    )
}

export default About;