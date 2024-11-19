import { VscGithub } from "react-icons/vsc";

import calculatorImg from '../img/Calculator.png'
import todolistImg from '../img/ToDoList.png'
import moneytrackerImg from '../img/MoneyTracker.png'
import keyboarddrumImg from '../img/KeyboardDrum.png'

const projects = [
    {
        image : moneytrackerImg,
        title : "Money Tracker",
        desc : "A basic MERN project to track expenses.",
        tools : ["React", "NodeJS", "MongoDB", "Express.js", "TailwindCSS"],
        link : "https://github.com/chgnw/MoneyTracker.git"
    },
    {
        image : calculatorImg,
        title : "Calculator",
        desc : "A retro-look web-based calculator created to learn more about ReactJS.",
        tools : ["React", "TailwindCSS"],
        link : "https://github.com/chgnw/Calculator.git"
    },
    {
        image : todolistImg,
        title : "To-Do List",
        desc : "A simple web-based to-do list with add and remove features.",
        tools : ["HTML", "TailwindCSS", "JavaScript"],
        link : "https://github.com/chgnw/ToDoList.git"
    },
    {
        image : keyboarddrumImg,
        title : "Keyboard Drum Minigame",
        desc : "Keyboard Drum Minigame using keyboard as the input.",
        tools : ["HTML", "TailwindCSS", "JavaScript"],
        link : "https://github.com/chgnw/KeyboardDrumGames.git"
    },
];


const Projects = () => {
    return (
        <>
            <section id="projects" className="flex flex-col items-center justify-center px-2 py-16 space-y-8">
                <span className="text-3xl hover:underline underline-offset-4">Recent Projects</span>

                <div className="grid grid-cols-1 gap-4">
                    {projects.map((project, index) => (
                        <div key={index} className="Card md:flex relative rounded-lg bg-[#222232] lg:w-[1000px]">
                            <div className='Image rounded-lg'>
                                <img src={project.image} alt="" className='lg:w-[500px] h-full rounded-l-lg'/>
                            </div>

                            <div className="flex flex-col">
                                <div className='px-4 py-2'>
                                    <span className="text-xl font-semibold">{project.title}</span>

                                    <p className="text-[#D4D4D4]">
                                        {project.desc}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {project.tools.map((tool, toolIndex) => (
                                            <span key={toolIndex} className="bg-[#8541df] px-2 rounded-lg text-sm hover:scale-105 transition ease-in-out delay-50">{tool}</span>
                                        ))}
                                    </div>
                                    

                                    <div>
                                        <a href="">
                                            <button className='md:absolute md:bottom-4 bg-[#9747FF] rounded-lg px-2 py-1 hover:bg-[#8541df] flex items-center justify-center mt-10'>
                                                <VscGithub size={20} className="mr-1"/>| GitHub 
                                            </button>
                                        </a>
                                    </div>
                                </div>   
                            </div>
                        </div>
                    ))} 
                </div>
            </section>
        </>
    )
}

export default Projects;