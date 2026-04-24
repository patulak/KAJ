function show_view(view_name) {
  document.querySelectorAll("main > section").forEach(section => {
    section.hidden = section.id !== `view-${view_name}`;
  });
  //app_state.current_view = view_name;
}