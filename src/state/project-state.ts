namespace App {
    type Listener = (items: Project[]) => void

    // project state management
    export class ProjectState {
        private listeners: Listener[] = []
        private projects: Project[] = []
        private static instance: ProjectState;
    
        private constructor() {}
    
        //singleton constructor.
        static getInstance() {
            if (this.instance) {
                return this.instance
            }
            this.instance = new ProjectState();
            return this.instance
        }
    
        addProject(title: string, description: string, numOfPeople: number) {
            const newProject = new Project(
                Math.random().toString(), 
                title, 
                description, 
                numOfPeople, 
                ProjectStatus.Active
            );
    
            this.projects.push(newProject);
            this.updateListeners()
        }
    
        moveProject(projectId: string, newStatus: ProjectStatus) {
            const project = this.projects.find(prj => prj.id === projectId);
            if (project && project.status !== newStatus) { 
                project.status = newStatus;
                this.updateListeners()
            }
        }
    
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    
        addListener(listenerFn: Listener) {
            this.listeners.push(listenerFn);
        }
    }
    
    export const projectState = ProjectState.getInstance();
}
