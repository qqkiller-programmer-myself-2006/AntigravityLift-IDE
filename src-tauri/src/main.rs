// Graviton IDE - Main Entry Point
// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod mcp_client;

use mcp_client::{ExtensionManager, ExtensionRequest, ExtensionResponse};
use std::sync::Mutex;
use tauri::State;

/// Global state for the extension manager
struct AppState {
    extension_manager: Mutex<ExtensionManager>,
}

/// Tauri command: graviton_extension_invoke
/// Invokes an extension with the given prompt
#[tauri::command]
fn invoke_extension(
    state: State<AppState>,
    prompt: String,
    extension_id: String,
) -> Result<ExtensionResponse, String> {
    let manager = state.extension_manager.lock().map_err(|e| e.to_string())?;
    
    let request = ExtensionRequest {
        prompt,
        extension_id,
    };
    
    manager.invoke_extension(&request)
}

/// Tauri command: graviton_extension_list
/// Lists all available extensions
#[tauri::command]
fn list_extensions(state: State<AppState>) -> Result<Vec<(String, String)>, String> {
    let manager = state.extension_manager.lock().map_err(|e| e.to_string())?;
    
    Ok(manager
        .list_extensions()
        .into_iter()
        .map(|(id, name)| (id.to_string(), name.to_string()))
        .collect())
}

/// Tauri command: greet (simple test command)
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to Graviton IDE.", name)
}

fn main() {
    // Initialize extension manager with defaults
    let mut extension_manager = ExtensionManager::new();
    extension_manager.load_defaults();
    
    let app_state = AppState {
        extension_manager: Mutex::new(extension_manager),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            greet,
            invoke_extension,
            list_extensions
        ])
        .run(tauri::generate_context!())
        .expect("error while running Graviton IDE");
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::mcp_client::{Extension, MockExtension};

    #[test]
    fn test_mcp_client_loads_correctly() {
        let mut manager = ExtensionManager::new();
        manager.load_defaults();
        
        // Verify the mock extension is loaded
        let extensions = manager.list_extensions();
        assert!(!extensions.is_empty(), "Extension manager should have loaded default extensions");
        
        // Verify we can invoke the mock extension
        let request = ExtensionRequest {
            prompt: "Hello from test".to_string(),
            extension_id: "mock_echo".to_string(),
        };
        
        let result = manager.invoke_extension(&request);
        assert!(result.is_ok(), "Mock extension should respond successfully");
        
        let response = result.unwrap();
        assert!(response.success, "Response should indicate success");
        assert!(
            response.content.contains("Hello from test"),
            "Response should contain the original prompt"
        );
    }

    #[test]
    fn test_extension_trait_implementation() {
        let mock = MockExtension::new();
        assert_eq!(mock.get_id(), "mock_echo");
        assert_eq!(mock.get_name(), "Mock Echo Extension");
    }
}
