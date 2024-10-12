
import proj1 from '../img/expenseTracker-EndProduct.png'
import proj2 from '../img/ToDoList-EndProduct.png'
import proj3 from '../img/KeyboardDrum-EndProduct.png'
import proj4 from '../img/Calculator.png'

const Project = () => {
    return (
        <section id="projects" className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
                Recent <span className="text-acc-l dark:text-acc-d">Projects</span>
            </h2>

            <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div id='proj-1' className='flex flex-col rounded-lg border-2 border-acc-l hover:border-acc-d'>
                        <div className="">
                            <img src={proj1} alt="" className="rounded-t-lg"/>
                        </div>

                        <div className="p-2">
                            <h5 className="font-semibold text-md md:text-lg lg:text-2xl">Expense Tracker</h5>
                            <p className="font-medium text-justify text-sm md:text-md lg:text-lg">
                                A simple income and expense tracker to help user keep track of their money and manage them.
                            </p>

                            <div className="mt-4 flex justify-end">
                                <button className="bg-acc-l px-2 py-1 rounded-lg text-white hover:bg-acc-d dark:bg-acc-d dark:hover:bg-acc-l">
                                    <a href="https://github.com/chgnw/ExpenseCalculator.git">View in GitHub</a>
                                </button>
                            </div>
                        </div>                       
                    </div>

                    <div id='proj-2' className='flex flex-col rounded-lg border-2 border-acc-l hover:border-acc-d'>
                        <div className="">
                            <img src={proj2} alt="" className="rounded-t-lg"/>
                        </div>

                        <div className="p-2">
                            <h5 className="font-semibold text-md md:text-lg lg:text-2xl">To-Do List</h5>
                            <p className="font-medium text-justify text-sm md:text-md lg:text-lg">
                                A simple to-do list website that allows users to add and remove tasks. Once a task is done, users can check it off, and their progress will be saved using localStorage.
                            </p>

                            <div className="mt-4 flex justify-end">
                                <button className="bg-acc-l px-2 py-1 rounded-lg text-white hover:bg-acc-d dark:bg-acc-d dark:hover:bg-acc-l">
                                    <a href="https://github.com/chgnw/ToDoList.git">View in GitHub</a>
                                </button>
                            </div>
                        </div>                       
                    </div>

                    <div id='proj-3' className='flex flex-col rounded-lg border-2 border-acc-l hover:border-acc-d'>
                        <div className="">
                            <img src={proj3} alt="" className="rounded-t-lg"/>
                        </div>

                        <div className="p-2">
                            <h5 className="font-semibold text-md md:text-lg lg:text-2xl">Keyboard-Drum Mini Games</h5>
                            <p className="font-medium text-justify text-sm md:text-md lg:text-lg">
                                A simple keyboard-drum game that can be played by pressing certain keys on your keyboard.
                            </p>

                            <div className="mt-4 flex justify-end">
                                <button className="bg-acc-l px-2 py-1 rounded-lg text-white hover:bg-acc-d dark:bg-acc-d dark:hover:bg-acc-l">
                                    <a href="https://github.com/chgnw/KeyboardDrumGames.git">View in GitHub</a>
                                </button>
                            </div>
                        </div>                       
                    </div>

                    <div id='proj-4' className='flex flex-col rounded-lg border-2 border-acc-l hover:border-acc-d'>
                        <div className="">
                            <img src={proj4} alt="" className="rounded-t-lg"/>
                        </div>

                        <div className="p-2">
                            <h5 className="font-semibold text-md md:text-lg lg:text-2xl">Calculator</h5>
                            <p className="font-medium text-justify text-sm md:text-md lg:text-lg">
                                Basic calculator function that build using React framework and TailwindCSS for the styling.
                            </p>

                            <div className="mt-4 flex justify-end">
                                <button className="bg-acc-l px-2 py-1 rounded-lg text-white hover:bg-acc-d dark:bg-acc-d dark:hover:bg-acc-l">
                                    <a href="https://github.com/chgnw/Calculator.git">View in GitHub</a>
                                </button>
                            </div>
                        </div>                       
                    </div>
                </div>
            </div>
        </section>
    );
  };
  
  export default Project;