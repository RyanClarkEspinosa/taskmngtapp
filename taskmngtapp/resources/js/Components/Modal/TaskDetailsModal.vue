<script setup>
import {ref, reactive} from 'vue';
import { useTasks } from '../../Functions/task-functions';

const tasks = reactive(useTasks());

</script>
<template>
    <div
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
  
>
  <div role="dialog" aria-modal="true" class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
    <h2 class="mb-4 text-lg font-semibold">Task details</h2>

    <dl class="space-y-3 text-sm">
      <div>
        <dt class="text-slate-500">Client Name</dt>
        <dd class="font-medium text-slate-900">{{ tasks.form.client_name }}</dd>
      </div>
      <div>
        <dt class="text-slate-500">Project Name</dt>
        <dd class="font-medium text-slate-900">{{ tasks.form.proj_name }}</dd>
      </div>
      <div>
        <dt class="text-slate-500">Description</dt>
        <dd class="whitespace-pre-line text-slate-900">{{ tasks.form.task_desc }}</dd>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <dt class="text-slate-500">Status</dt>
          <dd class="font-medium text-slate-900">
            {{ tasks.statusLabels[tasks.form.task_status] ?? tasks.form.task_status }}
          </dd>
        </div>
        <div>
          <dt class="text-slate-500">Priority</dt>
          <dd
            class="font-medium"
            :class="{
              'text-red-600': tasks.form.task_priority === 'High',
              'text-amber-600': tasks.form.task_priority === 'Medium',
              'text-green-600': tasks.form.task_priority === 'Low',
            }"
          >
            {{ tasks.form.task_priority }}
          </dd>
        </div>
        <div>
          <dt class="text-slate-500">Start Date</dt>
          <dd class="font-medium text-slate-900">{{ tasks.formatDate(tasks.form.task_start_date) }}</dd>
        </div>
        <div>
          <dt class="text-slate-500">Due Date</dt>
          <dd
            class="font-medium"
            :class="tasks.form.task_status !== 'completed' && tasks.isDueToday(tasks.form.task_due_date)
              ? 'text-red-600' : 'text-slate-900'"
          >
            {{ tasks.formatDate(tasks.form.task_due_date) }}
          </dd>
        </div>
      </div>
    </dl>

    <div class="mt-6 flex justify-end">
      <button
        type="button"
        class="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
        @click="tasks.showDetailsModal = false"
      >
        Close
      </button>
    </div>
  </div>
</div>
</template>