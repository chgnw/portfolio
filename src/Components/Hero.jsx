import { motion } from "framer-motion"

const Hero = () => {
    return (
        <>
            <motion.section variants={{ hidden: {opacity: 0}, show: {opacity: 1}, transition: {staggerChildren: 0.01} }} initial='hidden' animate='show' id="home" className="Container flex flex-col items-center justify-center py-16 md:py-32 space-y-2">
                <motion.div variants={{ hidden: {opacity: 0}, show: {opacity: 1} }} className="Name flex flex-col items-center justify-center">
                    <span className="text-6xl font-semibold">Christopher</span>
                    <span className="text-6xl font-semibold">Gunawan</span>
                </motion.div>

                <motion.div variants={{ hidden: {opacity: 0}, show: {opacity: 1} }} className="Location">
                    <span className="text-xl font-medium text-[#d4d4d4]">Based in North Jakarta, Indonesia</span>
                </motion.div>

                <motion.div variants={{ hidden: {opacity: 0}, show: {opacity: 1} }} className="space-x-4">
                    <a href="#projects">
                        <button className="bg-[#9747FF] rounded-lg py-2 px-3 hover:bg-[#8541df] hover:scale-105 transition ease-in-out delay-100 font-medium text-lg">
                            View Projects
                        </button>
                    </a>

                    <a href="#contacts">
                        <button className="border border-1 border-white rounded-lg py-2 px-3 hover:scale-105 transition ease-in-out delay-100 font-medium text-lg">
                            Contact Me
                        </button>
                    </a>
                </motion.div>
                
            </motion.section>
        </>
    )
}

export default Hero;