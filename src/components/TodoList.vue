<script setup>
import { ref, watch } from 'vue';
import { useTodoStore } from '@/stores/todoStore';

const store = useTodoStore();
const newTodo = ref('');
const editedTodo = ref(null);
const editedText = ref('');
const editError = ref('');
const activeTab = ref('pending');


const selectedTodos = ref([]);


const addTodo = () => {
    if (newTodo.value.trim()) {
        store.addTodo(newTodo.value);
        newTodo.value = '';
    }
};


const editTodo = (todo) => {
    editedTodo.value = todo;
    editedText.value = todo.text;
    editError.value = '';
};


const saveEdit = (id) => {
    if (!editedText.value.trim()) {
        editError.value = "Task name cannot be empty!";
        return;
    }
    store.updateTodo(id, editedText.value);
    editedTodo.value = null;
    editedText.value = '';
    editError.value = '';
};


const completeSelected = () => {
    selectedTodos.value.forEach((id) => {
        store.toggleTodo(id);
    });

    selectedTodos.value = [];
};


const deleteSelected = () => {
    selectedTodos.value.forEach((id) => {
        store.removeTodo(id);
    });

    selectedTodos.value = [];
};

watch(
    () => store.todos,
    (newTodos) => {
        localStorage.setItem('todos', JSON.stringify(newTodos));
    },
    { deep: true }
);
</script>

<template>
    <div class="w-1/2 mx-auto mt-0 bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center mb-4 font-serif">TODO LIST</h1>

        <div class="flex gap-2 mb-6">
            <input v-model="newTodo" class="border p-2 flex-1 rounded-md" placeholder="Enter a task"
                @keyup.enter="addTodo" />
            <button data-test="add-button" @click="addTodo" class="btn btn-success">ADD</button>
        </div>

        <!-- Tabs -->
        <div class="flex justify-start mb-4 font-serif">
            <button data-test="pending-tab" @click="activeTab = 'pending'" class="px-4 py-2 mx-0 rounded-md transition"
                :class="activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'">
                Pending
            </button>
            <button data-test="completed-tab" @click="activeTab = 'completed'"
                class="px-4 py-2 mx-2 rounded-md transition"
                :class="activeTab === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'">
                Completed
            </button>
            <button data-test="deleted-tab" @click="activeTab = 'deleted'" class="px-4 py-2 mx-2 rounded-md transition"
                :class="activeTab === 'deleted' ? 'bg-red-500 text-white' : 'bg-gray-200'">
                Deleted
            </button>
        </div>

        <!-- Bulk Actions (only for Pending tab) -->
        <div v-if="activeTab === 'pending'" class="mb-4 flex gap-2">
            <button data-test="bulk-complete" @click="completeSelected" class="btn btn-success">
                Complete Selected
            </button>
            <button data-test="bulk-delete" @click="deleteSelected" class="btn btn-danger">
                Delete Selected
            </button>
        </div>

        <!-- Pending Tasks Table -->
        <table v-if="activeTab === 'pending'" class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-3 text-center border font-serif">Select</th>
                    <th class="p-3 text-left border font-serif">Task</th>
                    <th class="p-3 text-center border">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="todo in store.pendingTodos" :key="todo.id" class="border-b" data-test="todo-item">
                    <td class="p-3 text-center border">
                        <input type="checkbox" :value="todo.id" v-model="selectedTodos" class="cursor-pointer" />
                    </td>
                    <td class="p-3 border">
                        <span v-if="editedTodo !== todo">{{ todo.text }}</span>
                        <div v-else>
                            <input v-model="editedText" data-test="edit-input"
                                class="border border-red-600 p-1 rounded w-full"
                                :class="{ 'border-red-500': editError }" />
                            <p v-if="editError" class="text-red-500 text-sm">{{ editError }}</p>
                        </div>
                    </td>
                    <td class="p-3 flex justify-center gap-2">

                        <button v-if="editedTodo !== todo" data-test="complete-button"
                            @click="store.toggleTodo(todo.id)" class="btn btn-success">
                            Complete
                        </button>

                        <button data-test="edit-button" @click="editTodo(todo)" class="btn btn-primary">
                            Edit
                        </button>
                        <button v-if="editedTodo !== todo" data-test="delete-button" @click="store.removeTodo(todo.id)"
                            class="btn btn-danger">
                            Delete
                        </button>

                        <button v-if="editedTodo === todo" data-test="save-button" @click="saveEdit(todo.id)"
                            class="btn btn-success">
                            Save
                        </button>

                        <button v-if="editedTodo === todo" data-test="cancel-button" @click="editedTodo = null"
                            class="btn btn-gray">
                            Cancel
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Completed Tasks Table -->
        <table v-if="activeTab === 'completed'" class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-3 text-left border font-serif">Task</th>
                    <th class="p-3 text-center border">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="todo in store.completedTodos" :key="todo.id" class="border-b">
                    <td class="p-3 border text-gray-500 line-through">{{ todo.text }}</td>
                    <td class="p-3 flex justify-center gap-2 border">
                        <button data-test="undo-button" @click="store.toggleTodo(todo.id)" class="btn btn-warning">
                            Undo
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Deleted Tasks Table -->
        <table v-if="activeTab === 'deleted'" class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-3 text-left border font-serif">Task</th>
                    <th class="p-3 text-center border">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="todo in store.deletedTodos" :key="todo.id" class="border-b">
                    <td class="p-3 border text-gray-500">{{ todo.text }}</td>
                    <td class="p-3 flex justify-center gap-2 border">
                        <button data-test="restore-button" @click="store.restoreDeleted(todo.id)"
                            class="btn btn-primary">
                            Restore
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<style scoped>
.line-through {
    text-decoration: line-through;
}

/* Tailwind-based button classes for consistency */
.btn {
    @apply inline-flex items-center justify-center px-4 py-0 rounded-md transition-colors;
}

.btn-success {
    @apply bg-green-500 text-white hover:bg-green-600;
}

.btn-danger {
    @apply bg-red-500 text-white hover:bg-red-600;
}

.btn-primary {
    @apply bg-blue-500 text-white hover:bg-blue-600;
}

.btn-warning {
    @apply bg-yellow-500 text-white hover:bg-yellow-600;
}

.btn-gray {
    @apply bg-gray-500 text-white hover:bg-gray-600;
}
</style>