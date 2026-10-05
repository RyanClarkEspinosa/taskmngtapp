<script setup>
import { ref, reactive, onMounted } from 'vue'
import TaskForm from '../Modal/TaskForm.vue'
import TaskDetailsModal from '../Modal/TaskDetailsModal.vue';
import { useTasks } from '../../Functions/task-functions';
 
// const tasks = useTasks();
const tasks = reactive(useTasks())

const columns = [
  { key: 'planning', label: 'Planning', dot: 'bg-sky-500' },
  { key: 'in_progress', label: 'In progress', dot: 'bg-amber-500' },
  { key: 'on_hold', label: 'On hold', dot: 'bg-slate-400' },
  { key: 'completed', label: 'Completed', dot: 'bg-emerald-500' },
]
 

onMounted(async()=>{
    await tasks.viewTasks()
  }
)
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 ">
    <header class="bg-slate-900">
      <div class="mx-auto max-w-3xl px-4 py-4">
        <h1 class="text-lg font-semibold text-white">Task manager</h1>
      </div>
    </header>

    <main class="mx-auto max-w-1xl w-full space-y-4 px-6 py-6 lg:px-10">
        <div class="flex flex-wrap items-center justify-end gap-x-4 gap-y-3">
    <label class="flex items-center gap-2 text-sm">
      <span>Search:</span>
      <input
        type="text"
        placeholder="Search tasks"
        class="h-10 w-48 rounded-md border border-slate-300 px-3"
        @input="tasks.applySearch($event.target.value)"
      />
    </label>

    <label class="flex items-center gap-2 text-sm">
      <span>Filter Priority Level:</span>
      <select
        class="h-10 rounded-md border border-slate-300 bg-white px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        @change="tasks.filterByPriority($event.target.value)"
      >
        <option value="all">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </label>

    <label class="flex items-center gap-2 text-sm">
      <span>Filter Status:</span>
      <select
        class="h-10 rounded-md border border-slate-300 bg-white px-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        @change="tasks.filterByStatus($event.target.value)"
      >
        <option value="all">All</option>
        <option v-for="c in columns" :key="c.key" :value="c.key">{{ c.label }}</option>
      </select>
    </label>

    <button
      type="button"
      class="h-10 rounded-full bg-blue-600 px-5 font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      @click="tasks.showModal = true"
    >
      Add task
    </button>
  </div>
        <task-form v-if="tasks.showModal == true"/>
        <task-details-modal v-if="tasks.showDetailsModal == true" />
 
      <!-- Board: one column per status -->
      <section class="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="col in columns"
          :key="col.key"
          class="rounded-lg border border-slate-200 bg-slate-50 p-3"
        >
          
          <div class="mb-3 flex items-center justify-between px-1">
            <h2 class="flex items-center gap-2 font-semibold">
              <span class="size-2.5 rounded-full" :class="col.dot"></span>
              {{ col.label }}
            </h2>
            <span class="rounded-full bg-white px-2 py-0.5 text-sm text-slate-600 shadow-sm">
              {{ tasks.groups[col.key]?.length }}
            </span>
          </div>
 
          <ul class="space-y-3">
            <li
              v-for="task in tasks.groups[col.key]"
              :key="task.id"
              class="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p
                class="font-medium"
                :class="task.task_status === 'completed' ? 'text-slate-400 line-through' : '',task.status !== 'completed' && tasks.isDueToday(task.task_due_date)?'text-red-600':''"
              >
                Project Name: {{ task.proj_name }}
              </p>
              <p
                class="font-medium"
                :class="task.task_status !== 'completed' && tasks.isDueToday(task.task_due_date)?'text-red-600':''"
              >
                Priority Level: {{ task.task_priority }}
              </p>
              <p
                class="font-medium"
                :class="task.task_status !== 'completed' && tasks.isDueToday(task.task_due_date)?'text-red-600':''"
              >
                Due Date: {{ task.task_due_date }}
              </p>
 
              <div class="mt-3 flex items-center justify-between gap-2">
                <select
                  v-model="task.task_status"
                  :aria-label="`Change status of ${task.proj_name}`"
                  class="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  @change="tasks.updateTaskStatus(task.task_id, $event.target.value)"
                >
                  <option v-for="c in columns" :key="c.key" :value="c.key">{{ c.label }}</option>
                </select>
                <div class="absolute right-2 top-2" @click.stop>
                  <button
                    type="button"
                    class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    :aria-label="`More actions for ${task.proj_name}`"
                    aria-haspopup="menu"
                    @click="tasks.toggleMenu(task.task_id)"
                  >
                    <svg class="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <circle cx="10" cy="4" r="1.6" />
                      <circle cx="10" cy="10" r="1.6" />
                      <circle cx="10" cy="16" r="1.6" />
                    </svg>
                  </button>

                  <div
                    role="menu"
                    class="absolute right-0 top-full z-10 mt-1 w-36 rounded-md border border-slate-200 bg-white py-1 shadow-lg"
                    v-if="tasks.openMenuId === task.task_id"
                  >
                  <button
                      type="button"
                      role="menuitem"
                      class="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                      @click="tasks.showDetailsModal = true; tasks.selectTask(task)"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      class="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                      @click="tasks.showModal = true; tasks.selectTask(task)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      class="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      @click="tasks.deleteTask(task.task_id)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
 
          <p v-if="!tasks.groups[col.key]" class="px-1 py-6 text-center text-sm text-slate-400">
            No tasks here yet.
          </p>
        </div>
      </section>
    </main>
  </div>
</template>