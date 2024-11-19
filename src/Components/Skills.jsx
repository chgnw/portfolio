import java from '../img/java.png'
import c from '../img/c.png'
import html from '../img/html.png'
import python from '../img/python.png'
import react from '../img/react.png'
import tailwind from '../img/tailwind.png'
import mysql from '../img/mysql.png'
import js from '../img/js.png'

const skills = [
    {
        name : "Java",
        image : java,
    },
    {
        name : "C",
        image : c,
    },
    {
        name : "Python",
        image : python,
    },
    {
        name : "HTML",
        image : html,
    },
    {
        name : "TailwindCSS",
        image : tailwind,
    },
    {
        name : "JavaScript",
        image : js,
    },
    {
        name : "React",
        image : react,
    },    
    {
        name : "MySQL",
        image : mysql,
    },
]

const Skills = () => {
    return (
        <>
            <section id="skills" className="flex flex-col items-center justify-center py-16 space-y-4">
                <span className="text-3xl hover:underline underline-offset-4">Skills</span>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-left space-x-2 bg-[#222232] px-4 py-2 rounded-lg hover:scale-110 transition ease-in-out dealy-100">
                            <img src={skill.image} alt="" className='w-8 h-8 md:w-12 md:h-12 rounded-lg'/>
                            <span className='font-semibold text-[#d4d4d4]'>{skill.name}</span>
                        </div>
                    ))} 
                </div>
            </section>
        </>
    )
}

export default Skills;