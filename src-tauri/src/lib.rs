#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let result = tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!());

  if let Err(e) = result {
    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
      let log_path = format!("{}\\com.boolstudio.desktop\\tauri_error.txt", local_app_data);
      let _ = std::fs::write(log_path, format!("TAURI ERROR: {}\n", e));
    }
  }
}
