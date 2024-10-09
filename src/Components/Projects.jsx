import dummyImg from '../img/dummyimg.png'

const Project = () => {
    return (
        <section id="projects" className="p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
                Recent <span className="text-acc-l dark:text-acc-d">Project</span>
            </h2>

            <div className="flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div id='proj-1' className='flex flex-col rounded-lg border-2 border-acc-l hover:border-acc-d'>
                        <div className="">
                            <img src={dummyImg} alt="" className="rounded-t-lg"/>
                        </div>

                        <div className="p-2">
                            <h5 className="font-semibold text-md md:text-lg lg:text-2xl">Project Title</h5>
                            <p className="font-medium text-justify text-sm md:text-md lg:text-lg">
                                A simple to-do list website that allows users to add and remove tasks. Once a task is done, users can check it off, and their progress will be saved using localStorage.
                            </p>

                            <div className="mt-4 flex justify-end">
                                <button className="bg-acc-l px-2 py-1 rounded-lg text-white hover:bg-acc-d dark:bg-acc-d dark:hover:bg-acc-l">
                                    <a href="">View in GitHub</a>
                                </button>
                            </div>
                        </div>                       
                    </div>

                    <div id='proj-1' className='flex flex-col rounded-lg border-2 border-acc-l hover:border-acc-d'>
                        <div className="">
                            <img src={dummyImg} alt="" className="rounded-t-lg"/>
                        </div>

                        <div className="p-2">
                            <h5 className="font-semibold text-md md:text-lg lg:text-2xl">Project Title</h5>
                            <p className="font-medium text-justify text-sm md:text-md lg:text-lg">
                                A simple to-do list website that allows users to add and remove tasks. Once a task is done, users can check it off, and their progress will be saved using localStorage.
                            </p>

                            <div className="mt-4 flex justify-end">
                                <button className="bg-acc-l px-2 py-1 rounded-lg text-white hover:bg-acc-d dark:bg-acc-d dark:hover:bg-acc-l">
                                    <a href="">View in GitHub</a>
                                </button>
                            </div>
                        </div>                       
                    </div>

                    <div id='proj-1' className='flex flex-col rounded-lg border-2 border-acc-l hover:border-acc-d'>
                        <div className="">
                            <img src={dummyImg} alt="" className="rounded-t-lg"/>
                        </div>

                        <div className="p-2">
                            <h5 className="font-semibold text-md md:text-lg lg:text-2xl">Project Title</h5>
                            <p className="font-medium text-justify text-sm md:text-md lg:text-lg">
                                A simple to-do list website that allows users to add and remove tasks. Once a task is done, users can check it off, and their progress will be saved using localStorage.
                            </p>

                            <div className="mt-4 flex justify-end">
                                <button className="bg-acc-l px-2 py-1 rounded-lg text-white hover:bg-acc-d dark:bg-acc-d dark:hover:bg-acc-l">
                                    <a href="">View in GitHub</a>
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