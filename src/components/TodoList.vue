<script setup>
import { ref, watch } from 'vue';
import { useTodoStore } from '@/stores/todoStore';

const store = useTodoStore();
const newTodo = ref('');
const editedTodo = ref(null);
const editedText = ref('');
const editError = ref('');

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
            <button @click="addTodo" class="bg-green-500 text-white px-4 py-2 rounded-md">ADD</button>
        </div>

        <!-- Task Table -->
        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-200">
                    <th class="p-3 text-left border font-serif">Task</th>
                    <th class="p-3 text-center border">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="todo in store.todos" :key="todo.id" class="border-b">
                    <td class="p-3 border">
                        <span v-if="editedTodo !== todo" :class="{ 'line-through text-gray-600': todo.completed }">
                            {{ todo.text }}
                        </span>
                        <div v-else>
                            <input v-model="editedText" class="border p-1 rounded w-full"
                                :class="{ 'border-red-500': editError }" />
                            <p v-if="editError" class="text-red-500 text-sm">{{ editError }}</p>
                        </div>
                    </td>
                    <td class="p-3 flex justify-center gap-2 border">
                        <button v-if="editedTodo !== todo" @click="store.toggleTodo(todo.id)"
                            class="bg-green-500 text-white px-3 py-1 rounded-md">
                            {{ todo.completed ? 'Undo' : 'Complete' }}
                        </button>
                        <button v-if="editedTodo !== todo" @click="editTodo(todo)"
                            class="bg-blue-500 text-white px-3 py-1 rounded-md">Edit</button>
                        <button v-if="editedTodo === todo" @click="saveEdit(todo.id)"
                            class="bg-blue-700 text-white px-3 py-1 rounded-md">Save</button>
                        <button @click="store.removeTodo(todo.id)"
                            class="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
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
</style>
