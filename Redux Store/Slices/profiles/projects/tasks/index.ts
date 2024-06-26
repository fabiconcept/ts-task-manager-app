import { loadingState, Priority, TaskerStatus } from "@/lib/Enums";
import { TaskerProjectTask } from "@/lib/Interfaces";
import { RootState } from "@/Redux Store";
import { $fetchProjectTasks, $updateTaskStatus } from "@/Redux Store/Thunk";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const dummyData: TaskerProjectTask[] = [
    {
        task_id: "task-001",
        from_id: "user-100",
        title: "Task Alpha",
        shortDesc: "Initial task description for Alpha.",
        desc: "This is a more detailed description for Task Alpha. It involves initial setup and configuration.",
        priorityLevel: Priority.MEDIUM,
        status: TaskerStatus.INPROGRESS,
        assigneeCount: 1,
        assigneeList: ["John Doe"],
        created_on: "2024-04-20T10:00:00Z",
        last_update: "2024-04-20T11:00:00Z",
    },
    {
        task_id: "task-002",
        from_id: "user-101",
        title: "Task Beta",
        shortDesc: "Short description for Task Beta.",
        desc: "Detailed description for Task Beta. This task involves code review and refactoring.",
        priorityLevel: Priority.HIGH,
        status: TaskerStatus.PENDING,
        assigneeCount: 2,
        assigneeList: ["Jane Doe", "Alice Smith"],
        created_on: "2024-04-21T08:00:00Z",
        last_update: "2024-04-21T09:30:00Z",
    },
    {
        task_id: "task-003",
        from_id: "user-102",
        title: "Task Gamma",
        shortDesc: "Short description for Task Gamma.",
        desc: "Detailed description for Task Gamma. It involves designing user interfaces.",
        priorityLevel: Priority.MEDIUM,
        status: TaskerStatus.COMPLETE,
        assigneeCount: 3,
        assigneeList: ["Bob Brown", "Cathy Green", "David Blue"],
        created_on: "2024-04-22T09:00:00Z",
        last_update: "2024-04-22T10:15:00Z",
    },
    {
        task_id: "task-004",
        from_id: "user-103",
        title: "Task Delta",
        shortDesc: "Short description for Task Delta.",
        desc: "Detailed description for Task Delta. It involves testing and quality assurance.",
        priorityLevel: Priority.LOW,
        status: TaskerStatus.PENDING,
        assigneeCount: 0,
        assigneeList: [],
        created_on: "2024-04-23T07:00:00Z",
        last_update: "2024-04-23T07:45:00Z",
    },
    {
        task_id: "task-005",
        from_id: "user-104",
        title: "Task Epsilon",
        shortDesc: "Short description for Task Epsilon.",
        desc: "Detailed description for Task Epsilon. This task involves deploying the product.",
        priorityLevel: Priority.HIGH,
        status: TaskerStatus.PENDING,
        assigneeCount: 1,
        assigneeList: ["Edward White"],
        created_on: "2024-04-24T12:00:00Z",
        last_update: "2024-04-24T13:30:00Z",
    },
]

interface InitialState {
    loading: loadingState,
    errorMsg: string,
    tasksList: TaskerProjectTask[],
    current_Project: string,
    updating: loadingState,
    updateError: string
}

const initialState: InitialState = {
    loading: loadingState.IDLE,
    errorMsg: "",
    tasksList: [],
    current_Project: '',
    updating: loadingState.IDLE,
    updateError: ""
}

const tasksListSlice = createSlice({
    name: "tasksList",
    initialState,
    reducers: {
        addNewTask: (state, action: PayloadAction<TaskerProjectTask>) => {
            const $payload = action.payload;
            state.tasksList.push($payload);
         }
    },

    extraReducers: (builder) => {
        builder.addCase($fetchProjectTasks.pending, (state)=>{
            state.loading = loadingState.PENDING;
        });

        builder.addCase($fetchProjectTasks.rejected, (state) => { 
            state.loading = loadingState.FAILED;
        });

        builder.addCase($fetchProjectTasks.fulfilled, (state, action)=>{
            const payload = action.payload;
            const tasksList = payload.tasksResult;
            const project_id = payload.project_id;


            state.loading = loadingState.SUCCESS;
            state.errorMsg = "";
            state.tasksList = tasksList;
            state.current_Project = project_id;
        });

        builder.addCase($updateTaskStatus.pending, (state)=>{
            state.updating = loadingState.PENDING;
            state.updateError = "";
        });

        builder.addCase($updateTaskStatus.rejected, (state, action) => { 
            state.updating = loadingState.FAILED;
            state.updateError = "Failed to update last task!";
        });

        builder.addCase($updateTaskStatus.fulfilled, (state, action) => { 
            state.updating = loadingState.SUCCESS;
            state.updateError = "";

            const prevTaskList = state.tasksList;

            const updatedTaskList = prevTaskList.map((task)=>{
                if(task.task_id === action.payload.taskId) return ({...task, status: action.payload.newStatus})
                return task;
            });

            state.tasksList = updatedTaskList;
        });
    }
});

export const { addNewTask } = tasksListSlice.actions;
export const $tasksListSlice = tasksListSlice.reducer;

export const echoTasksListLoading = (state: RootState) => state.tasksList.loading;
export const echoTasksListError = (state: RootState) => state.tasksList.errorMsg;
export const echoTasksListResponse = (state: RootState) => state.tasksList.tasksList; 
export const echoTasksListCurrentProject = (state: RootState) => state.tasksList.current_Project; 
export const echoTasksListUpdatingState = (state: RootState) => state.tasksList.updating; 
export const echoTasksListUpdatingError = (state: RootState) => state.tasksList.updateError; 