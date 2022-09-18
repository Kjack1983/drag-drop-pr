/// <reference path='base-component.ts' />
/// <reference path='../decorators/decorators.ts' />
/// <reference path='../state/project-state.ts' />
/// <reference path='../models/project.ts' />
/// <reference path='../models/drag-drop.ts' />


namespace App {
    // Project list Class
    export class ProjectList extends Component<HTMLDivElement, HTMLElement> 
        implements DragTarget {
        assignedProjects: Project[];
    
        constructor(private type: 'active' | 'finished') {
            super('project-list', 'app', false, `${type}-projects`);
            this.assignedProjects = []
    
            this.configure();
            this.renderContent();
        }
    
        @autobind
        dragOverHandler(event: DragEvent) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault()
                const listEl = this.element.querySelector('ul')
                listEl?.classList.add('droppable')
            }
        }
    
        @autobind
        dropHandler(event: DragEvent) {
            const priId = event.dataTransfer!.getData('text/plain');
            projectState.moveProject(
                priId, 
                this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
            )
        }
    
        @autobind
        dragLeaveHandler(_: DragEvent) {
            const listEl = this.element.querySelector('ul')
            listEl?.classList.remove('droppable')
        }
    
        configure() {
            this.element.addEventListener('dragover', this.dragOverHandler)
            this.element.addEventListener('dragleave', this.dragLeaveHandler)
            this.element.addEventListener('drop', this.dropHandler)
    
            projectState.addListener((projects: Project[]) => {
                const relevantProjects = projects.filter(proj => {
                    if (this.type === 'active') {
                        return proj.status === ProjectStatus.Active
                    }
                    return proj.status === ProjectStatus.Finished
                })
                this.assignedProjects = relevantProjects
                this.renderProjects()
            })
        }
    
        renderContent() {
            const listId = `${this.type}-projects-list`
            this.element.querySelector('ul')!.id = listId;
            this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + 'PROJECTS'
        }
    
        private renderProjects() {
            const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement ;
            listEl.innerHTML = '';
            for (const prjItem of this.assignedProjects) {
                new ProjectItem(this.element.querySelector('ul')!.id, prjItem)
            }
        }
    }
}