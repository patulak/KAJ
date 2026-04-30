export function show_view(view_name) {
  document.querySelectorAll("main > section").forEach(section => {
    if (section.classList.contains("show-view")) {
      section.classList.remove("show-view");
    }
    if (section.id == `view-${view_name}`) {
      section.classList.add("show-view");
    }
  });
  //app_state.current_view = view_name;
}