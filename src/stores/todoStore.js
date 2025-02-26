import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: ref([]),
    filter: 'all',
  }),
  actions :{
    addTodo(text){
        const timestamp = Date.now();
        this.todos.push({id: timestamp, text, completed:false});
    },
    removeTodo(id){
        this.todos = this.todos.filter(todo =>todo.id !== id);
    },
    toggleTodo(id){
        const todo = this.todos.find(todo =>todo.id === id);
        if (todo) todo.completed = !todo.completed;
    },
    updateTodo(id,newText){
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) todo.text = newText;
    },
    setFilter(type){
        this.filter = type;
    }
  },
  getters:{
    completedTodos:(state) => state.todos.filter(todo => todo.completed),
    pendingTodos: (state) => state.todos.filter(todo => !todo.completed),
    filteredTodos: (state) => {
        if (state.filter === 'completed') return state.completedTodos;
      if (state.filter === 'pending') return state.pendingTodos;
      return state.todos;
    }
  }

});
