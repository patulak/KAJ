export function show_view(view_name) {
  document.querySelectorAll("main > section").forEach(section => {
    if (section.classList.contains("show-view")) {
      section.classList.remove("show-view");
    }
    if (section.id == `view-${view_name}`) {
      section.classList.add("show-view");
    }
  });

  document.querySelectorAll(".app-header div button").forEach(button => {
    if (button.classList.contains("selected")) {
      button.classList.remove("selected");
    }
    if (button.id == `${view_name}-button`) {
      button.classList.add("selected");
    }
  });
  //app_state.current_view = view_name;
}