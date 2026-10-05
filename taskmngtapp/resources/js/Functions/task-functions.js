import { ref, reactive } from 'vue'
import axios from 'axios'

const tasks = ref([])
const errors = ref({})
const openMenuId = ref(null)
const showModal = ref(false);
const loaded = ref(false)
const showDetailsModal = ref(false)
const statusFilter = ref('all')   
const priorityFilter = ref('all')   
const searchQuery = ref('')   

const emptyGroups = () => ({
  planning: [],
  in_progress: [],
  on_hold: [],
  completed: [],
})
const searchable = [
  'client_name', 'proj_name', 'task_desc',
  'task_status', 'task_priority',
  'task_start_date', 'task_due_date',
]
const form = ref({
    task_id: null,
    client_name: '',
    proj_name: '',
    task_desc: '',
    task_status:'',
    task_priority:'',
    task_start_date:null,
    task_due_date:null,
})

const touched = reactive({
    client_name: false,
    task_name: false,
    task_desc: false,
    task_status:false,
    task_priority:false,
    task_start_date:true,
    task_due_date:true,
})
const isRequired = ref(true);
const groups = ref(emptyGroups())
const priorityOrder = { high: 0, medium: 1, low: 2 }

export function useTasks() {
  // "view": load the list from Laravel and replace the data
  const viewTasks = async () => {
    try {
      const { data } = await axios.get('view-task')
      tasks.value = data
      tasksByStatus(data)
    } finally {
      loaded.value = true     // set even if the request fails, so the page doesn't hang
    }
    
  }

  // save new (no task_id) or edit (has task_id), then refresh the list
  const saveTask = async () => {
    errors.value = {}
    try {
        console.log(fieldError()=='' && dueError()=='' && startError()=='')
        if(fieldError()=='' && dueError()=='' && startError()==''){
            if (form.value.task_id) {
                // await axios.put(`/tasks/${form.task_id}`, form)
                await axios.put(`/edit-task`,form.value)
                alert('Task Updated Successfully')
            } else {
                 await axios.post(`/save-task`,form.value)
                 alert('Task Added Successfully')
            }
            showModal.value = false
            openMenuId.value = null
            await viewTasks()
            // return true
        }
    } catch (e) {
      if (e.response?.status === 422) errors.value = e.response.data.errors
      return false
    }
  }

  const deleteTask = async (id) => {
     if (!window.confirm('Are you sure you want to delete this task? This cannot be undone.')) return

    try {
        await axios.delete(`/delete-task?task_id=${id}`)
        await viewTasks()
    } catch (e) {
        console.error(e.response?.status, e.response?.data || e)
    }
  }

  const updateTaskStatus = async (id,status) => {
     if (!window.confirm('Are you sure you want to update this task? This cannot be undone.')) return

    try {
        await axios.put(`/edit-task-status?task_id=${id}&task_status=${status}`)
        await viewTasks()
    } catch (e) {
        console.error(e.response?.status, e.response?.data || e)
    }
  }

 
const tasksByStatus = (data) => {
   const result = emptyGroups()
  data.forEach((task) => {
    const status = task.task_status?.toLowerCase().trim()

    if (result[status]) {
      result[status].push(task)
    } else {
      console.log('Status not matched:', status)
    }
  })
  Object.values(result).forEach((list) => list.sort(byDueThenPriority))
  groups.value = result
}
const toggleMenu = (task_id)=>{
  console.log(task_id)
  openMenuId.value = openMenuId.value === task_id ? null : task_id 
}
const isDueToday = (dueDate) => {
  if (!dueDate) return false

  const now = new Date()
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')                       // e.g. "2026-10-04" (local time)

  return dueDate.slice(0, 10) <= today
}
const fieldError = (field_name, msg) =>{
    // console.log(form.value[field_name])
    // return 1
  return touched[field_name] && !form.value[field_name] ? `${msg} is required.` : ''
}

const startError =() =>{
  return touched.task_start_date && !form.value.task_start_date ? `Start Date is required.` : ''
}

const dueError = () => {
  if (!touched.task_due_date) return ''
  if (!form.value.task_due_date) return 'Due date is required.'
  if (form.value.task_start_date && form.value.task_due_date <= form.value.task_start_date) return 'Due date must be after the start date.'
    return '';
}
const selectTask = (task)=>{
    form.value = {
    task_id: task.task_id,
    client_name: task.client_name,
    proj_name: task.proj_name,
    task_desc: task.task_desc,
    task_status:task.task_status,
    task_priority:task.task_priority,
    task_start_date:task.task_start_date,
    task_due_date:task.task_due_date,
};
}
const closeForm = ()=>{
    showModal.value = false;
   form.value = {
    task_id: null,
    client_name: '',
    proj_name: '',
    task_desc: '',
    task_status:'',
    task_priority:'',
    task_start_date:null,
    task_due_date:null,
}
}
const priorityRank = (p) =>
  priorityOrder[String(p ?? '').toLowerCase().trim()] ?? 99   // unknown goes last

const dueKey = (d) => (d ? String(d).slice(0, 10) : '9999-12-31')

const byDueThenPriority = (a, b) =>
  dueKey(a.task_due_date).localeCompare(dueKey(b.task_due_date)) ||
  priorityRank(a.task_priority) - priorityRank(b.task_priority)
const statusLabels = {
  planning: 'Planning',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
}

const formatDate = (d) =>
  d
    ? new Date(String(d).slice(0, 10) + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : '-'
const applyFilters = () => {
  const result = emptyGroups()
  const q = searchQuery.value.toLowerCase().trim()

  tasks.value.forEach((task) => {
    const taskStatus = task.task_status?.toLowerCase().trim()
    const taskPriority = task.task_priority?.toLowerCase().trim()

    if (statusFilter.value !== 'all' && taskStatus !== statusFilter.value) return
    if (priorityFilter.value !== 'all' && taskPriority !== priorityFilter.value) return

    if (q) {
      const matches = searchable.some((key) =>
        String(task[key] ?? '').toLowerCase().replace(/_/g, ' ').includes(q)
      )
      if (!matches) return
    }

    if (result[taskStatus]) result[taskStatus].push(task)
  })

  Object.values(result).forEach((list) => list.sort(byDueThenPriority))  // remove if you don't want sorting
  groups.value = result
}

const filterByStatus = (status) => {
  statusFilter.value = String(status).toLowerCase()
  applyFilters()
}

const filterByPriority = (priority) => {
  priorityFilter.value = String(priority).toLowerCase()
  applyFilters()
}

const applySearch = (text) => {
  searchQuery.value = text ?? ''
  applyFilters()
}

  return { tasks, errors, viewTasks, saveTask, deleteTask, groups,toggleMenu,openMenuId
    ,showModal,loaded, isDueToday,dueError,startError,fieldError,isRequired,touched,form
    ,selectTask,close,closeForm,showDetailsModal,formatDate,statusLabels,updateTaskStatus,
    filterByStatus,filterByPriority,applySearch}
}