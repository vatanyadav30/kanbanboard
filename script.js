const addRef =document.querySelector('.action-wrapper .add');
const removeRef=document.querySelector('.action-wrapper .delete');
const modalRef=document.querySelector('.modal');
const textareaRef=document.querySelector('.left-section textarea');
const taskWrapperRef=document.querySelector('.tasks-wrapper');
const rightCategorySelectionRef=document.querySelectorAll('.right-section .category');
const headerFilterCategoryRef=document.querySelector('header .category-wrapper')
const taskSearchRef=document.querySelector('.task-search input');

addRef.addEventListener('click', function(event){
    toggleModal(); // to toggle modal when click on + icon
});


function defaultCategorySelection(){ 
    removeAllCategorySelection(); // fn to remove selected class from everywhere in right section
    const firstCategory=document.querySelector('.right-section .category.p1');  // get reference of first class category.p1 
    firstCategory.classList.add('selected'); // add selected class to it
}

function toggleModal(){
    const isHidden=modalRef.classList.contains('hide'); // check if modal contains hide class
    if(isHidden){
        modalRef.classList.remove('hide'); // if yes, remmove it so that it can become visible
    }
    else{
        defaultCategorySelection(); //  calling function to default first category as selected
        modalRef.classList.add('hide'); // else , remove it to hide it
    }
}

const tasks=JSON.parse (localStorage.getItem('tasks')  || '[]' ); // creating tasks array to store tasks

function renderTaskList(){
    tasks.forEach(function(task){
        createTask(task);
    })
}
renderTaskList();

function addTasksinData(newTask){
    tasks.push(newTask); 
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



textareaRef.addEventListener('keydown', function(event){  
    if(event.key=== "Enter"){  

        const rightSelectedCategory=document.querySelector('.right-section .category.selected'); // got ref of right section catgeory which has selcted class
        const categoryName=rightSelectedCategory.getAttribute('data-category');// getting data-category attribute for the same

        const newTask={ // creating a object
            id: "Tid-"+ Math.round(Math.random()*10000000 ), 
            tittle:event.target.value, 
            category:categoryName 
        }

        addTasksinData(newTask);
        
        //console.log(tasks);
        event.target.value=""; // emptying the text area
        toggleModal();  

        createTask(newTask); 
        
    }
    
})

function createTask(task){
    const taskRef=document.createElement('div'); // creating div
    taskRef.className='task';   // name class as task
    //taskRef.setAttribute('data-id',task.id);
    taskRef.dataset.id=task.id;
    taskRef.innerHTML=` 
        <div class="task-category" data-priority=${task.category}></div>
        <div class="task-id"> ${task.id}</div>
        <div class="task-tittle"> <textarea>${task.tittle} </textarea></div>
        <div class="task-delete-icon"> <i class="fa-solid fa-trash"></i> </div>
    `;
    taskWrapperRef.appendChild(taskRef); // added to taskwrapperRef

    const textAreaRef=taskRef.querySelector('.task-tittle textarea');
    textAreaRef.addEventListener('change', function(event){
        const updatedTittle=event.target.value;
        const taskID=task.id;
        updatedTittleinData(updatedTittle,taskID);
    })


    // This way we can add  indiviual event listeners to every task-- but it os very hard --so many event --- as no of events will increase
    /*
    const deleteIconRef=taskRef.querySelector('.task-delete-icon .fa-trash');
    deleteIconRef.addEventListener('click',function(event){
        //console.log(event.target.parentElement.parentElement);
        //event.target.parentElement.parentElement.remove();
        const selectedTask=event.target.closest('.task');
        selectedTask.remove();
        deleteTaskFromData(task.id);
        console.log(tasks);
        
    })
    */
}

rightCategorySelectionRef.forEach( function(categoryRef){ 
    categoryRef.addEventListener('click', function(e){ // EL to set class as selcted in right Category
        //console.log(e.target);
        removeAllCategorySelection();
        e.target.classList.add('selected');
    })
})

function removeAllCategorySelection(){ //fun to remove class selected
    rightCategorySelectionRef.forEach( function(categoryRef){
        categoryRef.classList.remove('selected');
    })
}
function deleteTaskFromData(taskID){ // fn to delete task from array

    const selectedTaskIndex=tasks.findIndex( (tasks) => tasks.id===taskID ) // to find index of task in tasks array
    tasks.splice(selectedTaskIndex,1); //delete via splice method
    localStorage.setItem('tasks', JSON.stringify(tasks));

}

function updatedTittleinData(updatedTittle, taskID){
    const selectedTaskIndx=tasks.findIndex( (task) => task.id ===taskID);

    const selectedTask=tasks[selectedTaskIndx];
    selectedTask.tittle=updatedTittle;
    tasks.splice(selectedTaskIndx, 1, selectedTask )

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// using the concept of event bubbling to delete the icon
taskWrapperRef.addEventListener('click', function(event){
    //console.log(event.target);
    
    if(event.target.classList.contains('fa-trash')){
        const selectedTask=event.target.closest('.task');

        // const selectedTaskIDRef=selectedTask.querySelector('.task-id');
        // const taskID=  selectedTaskIDRef.innerText

        const taskID=selectedTask.dataset.id;
        selectedTask.remove();
        deleteTaskFromData(taskID);

        //console.log(tasks);

    }


    if(event.target.classList.contains('task-category')){
        const currentPriority=event.target.dataset.priority;
        const nextPriority=getNextPriority(currentPriority);
        event.target.dataset.priority=nextPriority;
        const taskID=event.target.closest('.task').dataset.id;
        updatePriorityInData(taskID, nextPriority);
    }

})


function updatePriorityInData(taskID, nextPriority){
    const taskIndex=tasks.findIndex((tasks) =>tasks.id === taskID);
    tasks[taskIndex].category=nextPriority;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getNextPriority(currentPriority){

    const priorityList=['p1', 'p2', 'p3' ,'p4'];
    const currentPriorityIndex = priorityList.findIndex( (p) => p==currentPriority);
    const nextPriorityIndex=(currentPriorityIndex+1)%4;

    const nextPriority= priorityList[nextPriorityIndex];
    return nextPriority;

}

headerFilterCategoryRef.addEventListener('click',function(event){
    if(event.target.classList.contains('category')){
        const selectedPriority=event.target.dataset.priority;
        
        const tasksListRef=document.querySelectorAll('.task');
        tasksListRef.forEach(function(taskRef){

            taskRef.classList.remove('hide');
            const currentTaskPriority=taskRef.querySelector('.task-category').dataset.priority;
            if(selectedPriority!==currentTaskPriority ){
                taskRef.classList.add('hide');
            }
        })
    }
})

removeRef.addEventListener('click', function(e){
    const isDeleteEnabled=e.target.classList.contains('enabled');
    if(isDeleteEnabled){
        e.target.classList.remove('enabled');
        taskWrapperRef.dataset.deleteDisabled=true; // data set would convert deleteDisabled to delete-disabled
        //taskWrapperRef.setAttribute('data-delete-disabled',true); --another way to write
        // now we are hide via css, another way but that is bad we can loop through all tasks, and hide the delete icon
    }
    else{
        e.target.classList.add('enabled');
        taskWrapperRef.setAttribute('data-delete-disabled',false);
    }
})

taskSearchRef.addEventListener('keyup', function(event){

    // In memory-Data--> prefer this as we may don't have all elements in DOM

    taskWrapperRef.innerHTML="";  //remove all tasks 
    const searchText= event.target.value.toLowerCase(); 
    console.log(searchText);

    tasks.forEach(function(task){
        if(task.tittle.toLowerCase().includes(searchText)  // check if search text includes id or tittle--then will create tasks
            || task.id.toLowerCase().includes(searchText)
            || searchText.trim()=== "")
            {
                createTask(task);
            }
    })

    //DOM Reference-- sure 100% data is in DOM

})

