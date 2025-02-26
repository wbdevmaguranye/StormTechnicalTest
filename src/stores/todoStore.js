import { defineStore } from 'pinia';
import { ref, watch  } from 'vue';
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: ref(JSON.parse(localStorage.getItem('todos')) || []),
    filter: 'all',
  }),
  actions :{
    addTodo(text){
        const timestamp = Date.now();
        this.todos.push({id: timestamp, text, completed:false});
        this.saveTodos();
    },
    removeTodo(id){
        this.todos = this.todos.filter(todo =>todo.id !== id);
        this.saveTodos();
    },
    toggleTodo(id){
        const todo = this.todos.find(todo =>todo.id === id);
        if (todo) todo.completed = !todo.completed;
        this.saveTodos();
    },
    updateTodo(id,newText){
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) todo.text = newText;
        this.saveTodos();
    },
    setFilter(type){
        this.filter = type;
    },
    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
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
  },
  

});

