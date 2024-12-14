

const API_URL = 'http://graphql.unicaen.fr:4000'

const SIGN_IN = `
  mutation($username: String!, $password: String!) {
    signIn(username: $username, password: $password)
  }
`;

const SIGN_UP = `
mutation($username: String!, $password: String!) {
  signUp(username: $username, password: $password)
}
`;

const CREATE_TODOLIST = `mutation CreateTodoLists($input: [TodoListCreateInput!]!) {
  createTodoLists(input: $input) {
    todoLists {
      owner {
        username
      }
    }
  }
}`;
//On crée la mutation pour supprimer la todolist et tous les todos qui y sont rattachées
const DELETE_TODOLIST = `mutation($id: ID!) {
  deleteTodos(where: { belongsTo: {id: $id} }) {
    nodesDeleted
  }
   deleteTodoLists(where: { id: $id }) {
    nodesDeleted
  }
}
`;

//Mutation d'ajout de todo
const ADD_TODO = `mutation($content: String!, $id: ID!) {
  createTodos(
    input: {
      content: $content
      done: false
      belongsTo: {
        connect: { where: {id: $id} }
      }
    }
  ) {
    todos {
      id
      content
      done
    
    }
  }
}`;

const UPDATE_TODO = `mutation($id: ID!, $done: Boolean) {
  updateTodos(where: { id: $id }, update: { done: $done }) {
    todos {
      id
      content
      done
    }
  }
}`;



const DELETE_TODO = `mutation($id: ID!) {
  deleteTodos(where: { id : $id })
  {
    nodesDeleted
  }
}
`;
const TODOS = `query($id: ID!){
  todos(where:{belongsTo:{id:$id}}) {
    id
    content
    done
    belongsTo{title owner{username}}
  }
}`;
const TODO_DONE = `query Todos($where: TodoWhere) {
  todos(where: $where) {
    done
    content
  }
}`;

export async function checkDone(title, token) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`, // Using template literals for cleaner string concatenation
      },
      body: JSON.stringify({
        query: TODO_DONE, // Assuming this is a GraphQL query string
        variables: {
          where: {
            done: true, // Only fetch tasks marked as done
            belongsTo: { 
              title: title, // Filter by the title of the task
            },
          },
        },
      }),
    });

    // Check if the response is OK (status 200-299)
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Parse JSON response
    const jsonResponse = await response.json();

    // Check for errors in the GraphQL response
    if (jsonResponse.errors) {
      throw new Error(jsonResponse.errors[0].message || 'Unknown GraphQL error');
    }

    // Return the data from the response
    return jsonResponse.data.todos;

  } catch (error) {
    // Handle and throw the error
    console.error('Error fetching tasks:', error); // Optional: Log the error for debugging
    throw error;
  }
}


//
export async function getTodos(id, token) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        query: TODOS,
        variables: {
          id: id,
        },
      }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.errors != null) {
      throw jsonResponse.errors[0];
    }
    return jsonResponse.data.todos;
  } catch (error) {
    throw error;
  }
}
export function deleteTodo(id, token) {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      query: DELETE_TODO,
      variables: {
        id: id,
      },
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((jsonResponse) => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.deleteTodos;
    })
    .catch((error) => {
      throw error;
    });
};

export async function updateTodo(id, done, token) {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      query: UPDATE_TODO,
      variables: {
        id: id,
        done: done,
      },
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((jsonResponse) => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.updateTodos.todos[0];
    })
    .catch((error) => {
      throw error;
    });
}

const TODO_LISTS = `query TodoLists($where: TodoListWhere) {
  todoLists(where: $where) {
    id
    owner {
      username
    }
    title
  }
}`;

export function getTodoLists(username, token) {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      query: TODO_LISTS,
      variables: {
        where: {
          owner: {
            username: username,
          },
        },
      },
    }),
  })
    .then((response) => response.json())
    .then((jsonResponse) => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.todoLists;
    })
    .catch((error) => {
      throw error;
    });
}

/** */

export function addTodo(content, id, token) {
  if (content === "") return null;
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      query: ADD_TODO,
      variables: {
        content: content,
        id: id,
      },
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((jsonResponse) => {
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.createTodos.todos[0];
    })
    .catch((error) => {
      throw error;
    });
}
  export async function signIn(username, password) {
  try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: SIGN_IN,
          variables: {
            username: username,
            password: password,
          },
        }),
      });
      const jsonResponse = await response.json();
      if (jsonResponse.errors != null) {
        throw jsonResponse.errors[0];
      }
      return jsonResponse.data.signIn;
    } catch (error) {
      throw error;
    }

    
}

export async function signUp(username, password) {
    try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: SIGN_UP,
        variables: {
          username: username,
          password: password,
        },
      }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.errors != null) {
      throw jsonResponse.errors[0];
    }
    return jsonResponse.data.signUp;
  } catch (error) {
    throw error;
  }
  }

  export function addTodoLists(title, username, token) {
    if (title === "") return null;
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        query: CREATE_TODOLIST,
        variables: {
          input:[
            {
              title: title,
              owner :{
              connect : {where :{username}}
              }
            }
          ]
          
        },
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (jsonResponse.errors != null) {
          throw jsonResponse.errors[0];
        }
        return jsonResponse.data.createTodoLists.todoLists[0];
      })
      .catch((error) => {
        throw error;
      });
  }
      //Suppression de todoList
      export function deleteTodoList(id, token) {
        return fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            query: DELETE_TODOLIST,
            variables: {
              id: id,
            },
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((jsonResponse) => {
            if (jsonResponse.errors != null) {
              throw jsonResponse.errors[0];
            }
            return jsonResponse.data.deleteTodoLists;
          })
          .catch((error) => {
            throw error;
          });
  }
  
  const EDIT_TODO = `
    mutation EditTodo($update: TodoUpdateInput!, $where: TodoWhereUniqueInput!) {
        updateTodos(update: $update, where: $where) {
            todos {
                id
                content
                done
            }
        }
    }
`;

  
  export async function editTodo(id, content, token) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                query: EDIT_TODO,
                variables: {
                    update: { content: content },
                    where: { id: id }
                },
            }),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const jsonResponse = await response.json();
        
        if (jsonResponse.errors) {
            console.error('GraphQL Errors:', jsonResponse.errors);
            throw new Error(jsonResponse.errors[0].message);
        }
        
        // Assurez-vous que vous retournez bien la réponse attendue
        return jsonResponse.data.updateTodos.todos[0];
        
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
}
