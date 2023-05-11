import { c as create_ssr_component, d as add_classes, f as add_attribute, h as each, e as escape, i as null_to_empty, v as validate_component } from "../../chunks/index.js";
import * as d3 from "d3";
const ToDo_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: ':root{--x-color:rgb(103, 103, 103);--x-highlight:rgb(108, 38, 38);--checkbox-color:rgb(108, 38, 38);--font-size:24px;--line-height:calc(var(--font-size) * 3)}.todo.svelte-1r1p4g9.svelte-1r1p4g9{border-top:1px solid var(--color-outline);box-shadow:0 0 4px var(--color-shadow)}.todo-item.svelte-1r1p4g9.svelte-1r1p4g9{position:relative;display:flex;align-items:center}input[type="text"].svelte-1r1p4g9.svelte-1r1p4g9{font-family:inherit;font-weight:300;font-size:var(--font-size);line-height:var(--line-height);background-color:var(--color-bg);color:var(--color-text);border:none;width:90%;margin-left:40px}input[type="text"].svelte-1r1p4g9.svelte-1r1p4g9:focus{outline:none}input[type="text"].svelte-1r1p4g9.svelte-1r1p4g9:disabled{text-decoration:line-through;color:var(--x-color)}.remove.svelte-1r1p4g9.svelte-1r1p4g9{display:none;position:absolute;right:var(--font-size);background-color:var(--color-bg);font-size:calc(var(--font-size) * 2);color:var(--x-color);transition:color 0.2s ease-out;border:none}.remove.svelte-1r1p4g9.svelte-1r1p4g9:hover{color:var(--x-highlight)}.remove.svelte-1r1p4g9.svelte-1r1p4g9:after{content:"×"}.todo.svelte-1r1p4g9:hover .remove.svelte-1r1p4g9{display:block}',
  map: null
};
const ToDo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { todo } = $$props;
  let { removeTodo } = $$props;
  if ($$props.todo === void 0 && $$bindings.todo && todo !== void 0)
    $$bindings.todo(todo);
  if ($$props.removeTodo === void 0 && $$bindings.removeTodo && removeTodo !== void 0)
    $$bindings.removeTodo(removeTodo);
  $$result.css.add(css$2);
  return `<main class="${"todo svelte-1r1p4g9"}"><div class="${"todo-item svelte-1r1p4g9"}"><span${add_classes((todo.completed ? "completed" : "").trim())}><input placeholder="${"Deleted todo"}" type="${"text"}" ${todo.completed ? "disabled" : ""} class="${"svelte-1r1p4g9"}"${add_attribute("value", todo.text, 0)}></span>

        <button aria-label="${"Remove todo"}" class="${"remove svelte-1r1p4g9"}"></button></div>
</main>`;
});
const Graph_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: '.visualization.svelte-1rft5nv{font:25px sans-serif;margin:auto;margin-top:1px;text-align:middle}.tooltip-hidden.svelte-1rft5nv{visibility:hidden;font-family:"Nunito", sans-serif;width:200px;position:absolute}.tooltip-visible.svelte-1rft5nv{font:25px sans-serif;font-family:"Nunito", sans-serif;visibility:visible;background-color:#f0dba8;border-radius:10px;width:200px;color:black;position:absolute;padding:10px}',
  map: null
};
const Graph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { todo_record = [] } = $$props;
  let arcGenerator = d3.arc().innerRadius(10).outerRadius(100).padAngle(0.02).cornerRadius(4);
  let hovered = -1;
  let recorded_mouse_position = { x: 0, y: 0 };
  let pieAngleGenerator = d3.pie().value((d) => d[1]);
  let arc_data = [];
  const arc_color = d3.scaleLinear().range(["#faffd1", "#db921d", "#b86a04", "#a65d29", "#6e3003"]).domain([0, 3, 6, 9, 12]);
  if ($$props.todo_record === void 0 && $$bindings.todo_record && todo_record !== void 0)
    $$bindings.todo_record(todo_record);
  $$result.css.add(css$1);
  {
    {
      let todo_count_by_size = d3.rollups(todo_record, (v) => v.length, (d) => d.size);
      arc_data = pieAngleGenerator(todo_count_by_size);
      console.log(JSON.stringify(todo_record));
    }
  }
  return `<div class="${"visualization svelte-1rft5nv"}"><svg width="${"500"}" height="${"500"}"><g transform="${"translate(250, 120)"}">${each(arc_data, (data, index) => {
    return `<path${add_attribute(
      "d",
      arcGenerator({
        startAngle: data.startAngle,
        endAngle: data.endAngle
      }),
      0
    )}${add_attribute("fill", index === hovered ? "brown" : arc_color(data.data[0]), 0)}></path>`;
  })}</g></svg>
	<div class="${escape(null_to_empty("tooltip-hidden"), true) + " svelte-1rft5nv"}" style="${"left: " + escape(recorded_mouse_position.x + 40, true) + "px; top: " + escape(recorded_mouse_position.y + 40, true) + "px"}">${``}</div>
</div>`;
});
const App_svelte_svelte_type_style_lang = "";
const css = {
  code: '@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700&display=swap");:root{--color-bg:#ffffff;--color-outline:#c2c2c2;--color-shadow:hsl(0, 0%, 0%, 0.1);--color-text:#3f4252;--color-bg-1:hsla(0, 0%, 0%, 0.2);--color-shadow-1:hsl(0, 0%, 96%)}.svelte-1ipti2w,.svelte-1ipti2w::before,.svelte-1ipti2w::after{margin:0;padding:0;box-sizing:border-box}main.svelte-1ipti2w{text-align:center;font-family:"Nunito", sans-serif;font-weight:300;line-height:2;font-size:24px;color:var(--color-text);margin-top:100px}input.svelte-1ipti2w{font-family:inherit;font-weight:inherit;line-height:inherit;font-size:24px;width:100%}input.svelte-1ipti2w{padding-left:40px;line-height:72px;font-style:italic;border:none}.svelte-1ipti2w::placeholder{color:#9e9e9e}h1.svelte-1ipti2w{font-size:72px;font-weight:300;line-height:2}h2.svelte-1ipti2w{font-size:30px;font-weight:300;line-height:1.5}.todos.svelte-1ipti2w{display:inline-block;vertical-align:top;width:500px;background-color:var(--color-bg);border-radius:5px;border:1px solid var(--color-outline);box-shadow:0 0 4px var(--color-shadow)}.graph.svelte-1ipti2w{display:inline-block;margin-left:50px}.actions.svelte-1ipti2w{position:relative;display:flex;align-items:center;justify-content:space-between}.actions.svelte-1ipti2w:before{content:"";height:40px;position:absolute;right:0;bottom:0;left:0;box-shadow:0 1px 1px var(--color-shadow-1), 0 8px 0 -3px var(--color-shadow-1),\n            0 9px 1px -3px var(--color-bg-1), 0 16px 0 -6px var(--color-shadow-1),\n            0 17px 2px -6px var(--color-bg-1);z-index:-1}',
  map: null
};
let placeholder = "What do you need to do?";
const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let todo_text = "";
  let todos = [
    {
      id: "0",
      text: "Learn Svelte",
      completed: false
    },
    {
      id: "1",
      text: "Finish Lab",
      completed: false
    }
  ];
  let todo_record = [];
  let todo_len = 0;
  let todo_names = [];
  function removeTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
  }
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        todo_len = todos.length;
        if (todo_record.length == 0 || todo_len !== todo_record[todo_record.length - 1].size) {
          todo_names = todos.map((todo) => todo.text).reduce((names_as_string, new_todo) => names_as_string + new_todo + ", ", "");
          todo_record.push({
            index: todo_record.length + 1,
            size: todo_len,
            names: todo_names.slice(0, todo_names.length - 2)
          });
        }
        todo_record = todo_record;
      }
    }
    $$rendered = `<main class="${"svelte-1ipti2w"}"><section class="${"todos svelte-1ipti2w"}"><h1 class="${"svelte-1ipti2w"}">todos</h1>
        <form class="${"svelte-1ipti2w"}"><input${add_attribute("placeholder", placeholder, 0)} class="${"svelte-1ipti2w"}"${add_attribute("value", todo_text, 0)}></form>

        ${each(todos, (todo) => {
      return `${validate_component(ToDo, "ToDo").$$render(
        $$result,
        { removeTodo, todo },
        {
          todo: ($$value) => {
            todo = $$value;
            $$settled = false;
          }
        },
        {}
      )}`;
    })}

        <div class="${"actions svelte-1ipti2w"}"></div></section>

    <section class="${"graph svelte-1ipti2w"}"><h2 style="${"margin-top: 15px"}" class="${"svelte-1ipti2w"}">todo pie</h2>
        ${validate_component(Graph, "Graph").$$render(
      $$result,
      { todo_record },
      {
        todo_record: ($$value) => {
          todo_record = $$value;
          $$settled = false;
        }
      },
      {}
    )}</section>

</main>`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const prerender = true;
  const ssr = true;
  if ($$props.prerender === void 0 && $$bindings.prerender && prerender !== void 0)
    $$bindings.prerender(prerender);
  if ($$props.ssr === void 0 && $$bindings.ssr && ssr !== void 0)
    $$bindings.ssr(ssr);
  return `${validate_component(App, "App").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
