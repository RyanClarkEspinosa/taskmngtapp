<script setup>
import {ref, reactive} from 'vue';
import { useTasks } from '../../Functions/task-functions';

const tasks = reactive(useTasks());

const submit = async() => {
  touched.client_name = touched.start_date = touched.due_date = true
//   if (clientError() || startError() || dueError()) return
  if(isRequired.value){
    let response =  await tasks.saveTask(form)
    console.log(response)
  }

  console.log('Saved:', { ...form })
}
</script>
<template>
    <div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  
>
  <div class="w-full max-w-md rounded-lg bg-white p-6">
    <h2 class="mb-4 text-lg font-semibold">Add task</h2>
    <!-- <form novalidate @submit="submit"> -->
         <input
        v-model="tasks.form.task_start_date"
        type="date"
        required
        placeholder="Start Date"
        @blur="tasks.touched.task_start_date = true"
        class="mb-4 w-full rounded-md border border-slate-300 px-3 py-2"
        />
        <p class="mb-3 text-sm text-red-600">{{ tasks.startError() }}</p>
        <input
        v-model="tasks.form.task_due_date"
        type="date"
        required
        placeholder="Due Date"
        @blur="tasks.touched.task_due_date = true"
        class="mb-4 w-full rounded-md border border-slate-300 px-3 py-2"
        />
        <p class="mb-3 text-sm text-red-600">{{ tasks.dueError() }}</p>
        <input
        v-model="tasks.form.client_name"
        type="text"
        required
        placeholder="Client Name"
        @blur="tasks.touched.client_name = true"
        class="mb-4 w-full rounded-md border border-slate-300 px-3 py-2"
        />
        <p class="mb-3 text-sm text-red-600">{{ tasks.fieldError('client_name','Client Name') }}</p>
        <input
        v-model="tasks.form.proj_name"
        type="text"
        required
        placeholder="Project Name"
        @blur="tasks.touched.proj_name = true"
        class="mb-4 w-full rounded-md border border-slate-300 px-3 py-2"
        />
        <p class="mb-3 text-sm text-red-600">{{ tasks.fieldError('proj_name','Project Name') }}</p>
        <textarea
        v-model="tasks.form.task_desc"
        required
        placeholder="Description"
        @blur="tasks.touched.task_desc = true"
        class="mb-4 w-full rounded-md border border-slate-300 px-3 py-2"
        />
        <p class="mb-3 text-sm text-red-600">{{ tasks.fieldError('task_desc','Description') }}</p>
        <select
        v-model="tasks.form.task_status"
        required
        aria-label="Status"
        @blur="tasks.touched.task_status = true"
        class="mb-4 w-full rounded-md border border-slate-300 px-3 py-2"
        >
            <option value="" disabled>Select Status</option>
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
        </select>
        <p class="mb-3 text-sm text-red-600">{{ tasks.fieldError('task_status','Status') }}</p>
        <select
        v-model="tasks.form.task_priority"
        required
        aria-label="Priority"
        @blur="tasks.touched.task_priority = true"
        class="mb-4 w-full rounded-md border border-slate-300 px-3 py-2"
        >
            <option value="" disabled>Select priority level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
        </select>
        <p class="mb-3 text-sm text-red-600">{{ tasks.fieldError('task_priority','Priority') }}</p>
       
    <!-- </form> -->

    <div class="flex justify-end gap-2">
      <button
        type="button"
        class="rounded-md border border-slate-300 px-4 py-2"
        @click="tasks.closeForm()"
      >
        Cancel
      </button>
      <button
        type="button"
        class="rounded-md bg-blue-600 px-4 py-2 text-white"
        @click="tasks.saveTask()"
      >
        Save
      </button>
    </div>
  </div>
</div>
</template>