export function show_view(view_name) {
  document.querySelectorAll("main > section").forEach(section => {
    section.style.display = section.id !== `view-${view_name}` ? "none" : "flex";
  });
  //app_state.current_view = view_name;
}