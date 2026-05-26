export function show_view(view_name) { //this switch view
  
  document.querySelectorAll("main > section").forEach(section => {
    console.log("show:", section);
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

export function navigate_to(view_name) { //this changes url and switches
    history.pushState({ view: view_name }, "", `#${view_name}`);
    show_view(view_name);
}

export function handle_route() {
  const route = location.hash.replace("#", "");
  switch (route) {
    case "setup":
      show_view("setup");
      break;

    case "rules":
      show_view("rules");
      break;

    case "game":
      show_view("game");
      break;

    case "results":
      show_view("results");
      break;

    default:
      show_view("menu");
      break;
  }
}