// special thanks <https://sycamore.dev/book/introduction/todo-app>
use sycamore::{prelude::*, web::events::SubmitEvent};

#[derive(PartialEq, Eq, Clone)]
struct Todo {
    task: Signal<String>,
    completed: Signal<bool>,
    id: u32,
}

#[component]
fn App() -> View {
    let todos = create_signal::<Vec<Todo>>(Vec::new());

    let id_counter = create_signal(0);
    let incremental_id = move || id_counter.replace(id_counter.get() + 1);
    let add_todo = move |task: String| {
        todos.update(|todos| {
            todos.push(Todo {
                task: create_signal(task),
                completed: create_signal(false),
                id: incremental_id(),
            })
        })
    };
    let remove_todo = move |id: u32| todos.update(|todos| todos.retain(|t| t.id != id));

    view! {
        ul {
            Keyed(
                list=todos,
                view=move |item| view! { TodoItem(item=item, remove_todo=remove_todo) },
                key=|item| item.id
            )
        }
        TodoInput(add_todo=add_todo)
    }
}

#[component(inline_props)]
fn TodoItem<F: Fn(u32) + 'static>(item: Todo, remove_todo: F) -> View {
    let is_editing = create_signal(false);

    on_cleanup(move || {
        item.task.dispose();
        item.completed.dispose();
    });

    let style = move || {
        if item.completed.get() {
            "text-decoration: line-through; color: gray;"
        } else {
            ""
        }
    };

    view! {
        li (style=style) {
            input ("type"="checkbox", bind:checked=item.completed)
            (if is_editing.get() {
                view! {
                    form (on:submit=move |ev: SubmitEvent| {
                        ev.prevent_default();
                        is_editing.set(false);
                    }){
                        input (bind:value=item.task)
                        button (
                            "type"="submit",
                        ) { "Done" }
                    }
                }
            } else {
                view! {
                    span { (item.task) }
                    button (
                        on:click=move |_| is_editing.set(true)
                    ) {
                        "Edit"
                    }
            }})
            button (
                "type"="button",
                on:click=move |_| remove_todo(item.id)
            ) {
                "Remove"
            }
        }
    }
}

#[component(inline_props)]
fn TodoInput<F: Fn(String) + 'static>(add_todo: F) -> View {
    let input = create_signal(String::new());
    let onsubmit = move |ev: SubmitEvent| {
        if input.with(String::is_empty) {
            return;
        }
        ev.prevent_default();
        add_todo(input.get_clone());
        input.set(String::new());
    };

    view! {
        form(on:submit=onsubmit){
            input(bind:value=input)
            button ("type"="submit"){
                "Create"
            }
        }
    }
}
fn main() {
    sycamore::render(App);
}
