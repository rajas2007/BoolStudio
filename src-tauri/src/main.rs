// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(windows)]
unsafe extern "system" {
  fn CreateMutexW(
    lpMutexAttributes: *mut std::ffi::c_void,
    bInitialOwner: i32,
    lpName: *const u16,
  ) -> *mut std::ffi::c_void;
  fn GetLastError() -> u32;
  fn FindWindowW(lpClassName: *const u16, lpWindowName: *const u16) -> *mut std::ffi::c_void;
  fn SetForegroundWindow(hWnd: *mut std::ffi::c_void) -> i32;
  fn ShowWindow(hWnd: *mut std::ffi::c_void, nCmdShow: i32) -> i32;
}

fn main() {
  #[cfg(windows)]
  {
    // Single instance mutex guard to prevent WebView2 0x800700AA (Resource in use) crash
    let mutex_name: Vec<u16> = "Local\\BoolStudio_SingleInstance_Mutex\0"
      .encode_utf16()
      .collect();
    let _handle = unsafe { CreateMutexW(std::ptr::null_mut(), 1, mutex_name.as_ptr()) };
    const ERROR_ALREADY_EXISTS: u32 = 183;
    if unsafe { GetLastError() } == ERROR_ALREADY_EXISTS {
      // Another instance is already running; bring its window to front and exit cleanly
      let window_name: Vec<u16> = "BoolStudio\0".encode_utf16().collect();
      let hwnd = unsafe { FindWindowW(std::ptr::null(), window_name.as_ptr()) };
      if !hwnd.is_null() {
        unsafe {
          ShowWindow(hwnd, 9); // SW_RESTORE
          SetForegroundWindow(hwnd);
        }
      }
      return;
    }
  }

  // Panic hook to capture any unexpected runtime crashes
  std::panic::set_hook(Box::new(|info| {
    let err_msg = format!("PANIC: {}\n", info);
    eprintln!("{}", err_msg);
    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
      let log_path = format!("{}\\com.boolstudio.desktop\\panic.txt", local_app_data);
      let _ = std::fs::write(log_path, &err_msg);
    }
  }));

  boolstudio_lib::run();
}
